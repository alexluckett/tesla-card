import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { createImageCache, imageErrorAction, usable } from '../src/lib/image-cache.js'

/**
 * A stand-in for an IndexedDB database, implementing just enough of the
 * request/transaction shape that the cache actually uses. Without this the
 * tests would only exercise the in-process memo and never the stored copy,
 * which is the part that has to survive a page reload.
 */
function fakeDatabase(initial = {}) {
  const data = new Map(Object.entries(initial))
  const request = (result) => {
    const req = { result, onsuccess: null, onerror: null }
    queueMicrotask(() => req.onsuccess?.())
    return req
  }
  return {
    data,
    transaction() {
      const tx = { onabort: null, onerror: null, oncomplete: null }
      tx.objectStore = () => ({
        get: (key) => request(data.get(key) ?? undefined),
        put: (value, key) => request(void data.set(key, value)),
        getAllKeys: () => request([...data.keys()]),
        delete: (key) => {
          data.delete(key)
          return null
        }
      })
      queueMicrotask(() => tx.oncomplete?.())
      return tx
    }
  }
}

function makeCache({ db = fakeDatabase(), fetchImpl } = {}) {
  const calls = { fetches: [], revoked: [] }
  const cache = createImageCache({
    openDatabase: async () => db,
    fetchImage: async (url) => {
      calls.fetches.push(url)
      if (fetchImpl) return fetchImpl(url)
      return { size: 90000, type: 'image/png', url }
    },
    createObjectUrl: (blob) => `object:${blob.url ?? blob}`,
    revokeObjectUrl: (objectUrl) => calls.revoked.push(objectUrl)
  })
  return { cache, db, calls }
}

const A = 'https://tesla/render?options=A'
const B = 'https://tesla/render?options=B'

describe('image cache', () => {
  test('stores the render so it survives into a new card instance', async () => {
    // The point of the cache: Tesla send max-age=60, so a reload a minute
    // later must not go back to the network.
    const { cache, db, calls } = makeCache()
    await cache.resolve(A)
    assert.equal(calls.fetches.length, 1)
    assert.ok(db.data.has(A), 'the blob is written to the store')

    const second = makeCache({ db })
    const src = await second.cache.resolve(A)
    assert.equal(src, `object:${A}`)
    assert.equal(second.calls.fetches.length, 0, 'a fresh instance must not refetch')
  })

  test('serves the same object url within one instance', async () => {
    const { cache, calls } = makeCache()
    assert.equal(await cache.resolve(A), await cache.resolve(A))
    assert.equal(calls.fetches.length, 1)
  })

  test('two renders requested at once share a single fetch', async () => {
    const { cache, calls } = makeCache()
    const [a, b] = await Promise.all([cache.resolve(A), cache.resolve(A)])
    assert.equal(a, b)
    assert.equal(calls.fetches.length, 1)
  })

  test('a changed configuration is a different key, so it fetches again', async () => {
    const { cache, calls } = makeCache()
    await cache.resolve(A)
    await cache.resolve(B)
    assert.equal(calls.fetches.length, 2)
  })

  test('returns null when the image cannot be fetched, so the card can fall back', async () => {
    const { cache } = makeCache({
      fetchImpl: () => {
        throw new Error('offline')
      }
    })
    assert.equal(await cache.resolve(A), null)
  })

  test('a stored render still shows when the network is down', async () => {
    const db = fakeDatabase({ [A]: { size: 90000, type: 'image/png', url: A } })
    const { cache, calls } = makeCache({
      db,
      fetchImpl: () => {
        throw new Error('offline')
      }
    })
    assert.equal(await cache.resolve(A), `object:${A}`)
    assert.equal(calls.fetches.length, 0)
  })

  test('an unusable database does not stop the card rendering', async () => {
    const cache = createImageCache({
      openDatabase: async () => null,
      fetchImage: async () => ({ size: 90000, type: 'image/png', url: 'x' }),
      createObjectUrl: (b) => `object:${b.url}`,
      revokeObjectUrl: () => {}
    })
    assert.equal(await cache.resolve(A), 'object:x')
  })

  test('ignores an empty url', async () => {
    const { cache, calls } = makeCache()
    assert.equal(await cache.resolve(''), null)
    assert.equal(calls.fetches.length, 0)
  })

  test('prune drops renders the configuration no longer uses', async () => {
    const { cache, db, calls } = makeCache()
    await cache.resolve(A)
    await cache.resolve(B)
    assert.equal(db.data.size, 2)

    await cache.prune([B])

    assert.deepEqual(calls.revoked, [`object:${A}`])
    assert.deepEqual([...db.data.keys()], [B], 'the old colour is evicted from storage')
  })

  test('a failed response is never stored', async () => {
    const { cache, db } = makeCache({
      fetchImpl: () => {
        throw new Error('503 from the CDN')
      }
    })
    assert.equal(await cache.resolve(A), null)
    assert.equal(db.data.size, 0, 'a transient outage must not poison the cache')
  })

  test('a non-image body is rejected rather than stored', async () => {
    // An intercepting proxy can answer 200 with an HTML error page.
    const { cache, db } = makeCache({
      fetchImpl: () => ({ size: 4096, type: 'text/html' })
    })
    assert.equal(await cache.resolve(A), null)
    assert.equal(db.data.size, 0)
  })

  test('a truncated image is rejected rather than stored', async () => {
    const { cache, db } = makeCache({ fetchImpl: () => ({ size: 12, type: 'image/png' }) })
    assert.equal(await cache.resolve(A), null)
    assert.equal(db.data.size, 0)
  })

  test('rubbish already in the store is dropped and refetched', async () => {
    // Whatever the reason it got there, serving it again would keep the card
    // broken for as long as the configuration stayed the same.
    const db = fakeDatabase({ [A]: { size: 30, type: 'text/html' } })
    const { cache, calls } = makeCache({
      db,
      fetchImpl: () => ({ size: 90000, type: 'image/png' })
    })
    const src = await cache.resolve(A)
    assert.ok(src, 'a fresh copy is fetched')
    assert.equal(calls.fetches.length, 1)
    assert.equal(db.data.get(A).type, 'image/png', 'the good copy replaces the bad one')
  })

  test('evict forgets a render so the next resolve goes back to the network', async () => {
    const { cache, db, calls } = makeCache({
      fetchImpl: () => ({ size: 90000, type: 'image/png' })
    })
    await cache.resolve(A)
    assert.equal(calls.fetches.length, 1)

    await cache.evict(A)
    assert.equal(db.data.size, 0)
    assert.equal(calls.revoked.length, 1)

    await cache.resolve(A)
    assert.equal(calls.fetches.length, 2, 'an evicted render is fetched again')
  })

  test('release lets go of every object url', async () => {
    const { cache, calls } = makeCache()
    await cache.resolve(A)
    cache.release()
    assert.equal(calls.revoked.length, 1)
  })
})

describe('imageErrorAction', () => {
  const REMOTE = 'https://tesla/render?options=A'
  const STORED = 'blob:abc123'

  test('a stored copy that will not decode is thrown away and refetched', () => {
    // Without this the card stays blank for as long as the configuration is
    // unchanged, because the bad copy is served again on every render.
    assert.equal(imageErrorAction(STORED, REMOTE, new Set()), 'retry')
  })

  test('only retries once, so a genuinely broken render cannot loop', () => {
    assert.equal(imageErrorAction(STORED, REMOTE, new Set([REMOTE])), 'give-up')
  })

  test('a fresh copy straight from Tesla failing is a real failure', () => {
    assert.equal(imageErrorAction(REMOTE, REMOTE, new Set()), 'give-up')
  })

  test('nothing to retry when there is no url', () => {
    assert.equal(imageErrorAction(STORED, null, new Set()), 'give-up')
  })
})

describe('usable', () => {
  test('accepts a real render', () => {
    assert.equal(usable({ size: 90000, type: 'image/png' }), true)
  })

  test('rejects error pages, truncated downloads and nothing at all', () => {
    assert.equal(usable({ size: 4096, type: 'text/html' }), false)
    assert.equal(usable({ size: 10, type: 'image/png' }), false)
    assert.equal(usable({ size: 0, type: 'image/png' }), false)
    assert.equal(usable(null), false)
    assert.equal(usable({}), false)
  })
})
