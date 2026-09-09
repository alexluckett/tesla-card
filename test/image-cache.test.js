import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { createImageCache } from '../src/lib/image-cache.js'

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
      return `blob:${url}`
    },
    createObjectUrl: (blob) => `object:${blob}`,
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
    assert.equal(src, `object:blob:${A}`)
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
    const db = fakeDatabase({ [A]: `blob:${A}` })
    const { cache, calls } = makeCache({
      db,
      fetchImpl: () => {
        throw new Error('offline')
      }
    })
    assert.equal(await cache.resolve(A), `object:blob:${A}`)
    assert.equal(calls.fetches.length, 0)
  })

  test('an unusable database does not stop the card rendering', async () => {
    const cache = createImageCache({
      openDatabase: async () => null,
      fetchImage: async () => 'blob:x',
      createObjectUrl: (b) => `object:${b}`,
      revokeObjectUrl: () => {}
    })
    assert.equal(await cache.resolve(A), 'object:blob:x')
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

    assert.deepEqual(calls.revoked, [`object:blob:${A}`])
    assert.deepEqual([...db.data.keys()], [B], 'the old colour is evicted from storage')
  })

  test('release lets go of every object url', async () => {
    const { cache, calls } = makeCache()
    await cache.resolve(A)
    cache.release()
    assert.equal(calls.revoked.length, 1)
  })
})
