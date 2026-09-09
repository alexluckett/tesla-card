/**
 * Keeps the vehicle render in the browser until the configuration changes.
 *
 * Tesla serve the configurator image with `cache-control: max-age=60`, so the
 * browser would re-download it every minute for as long as a dashboard is
 * open. The picture only changes when the paint, wheels, angle or vehicle
 * change, and all of those are already in the URL — so the URL is the cache
 * key, and a stored copy stays valid until that key changes.
 *
 * IndexedDB rather than the Cache API: Home Assistant is often reached over
 * plain http on a local hostname, which is not a secure context, and
 * `caches` is unavailable there.
 */

const DB_NAME = 'tesla-card'
const DB_VERSION = 1
const STORE = 'renders'

/**
 * A render is a few tens of kilobytes. Anything smaller is a truncated
 * response or an error page, and must never reach the store: a cache keyed by
 * configuration would serve it back forever.
 */
const MIN_BYTES = 512

/**
 * @param {object} [deps] Injection points, so the logic is testable without a
 *   browser. Defaults use the real IndexedDB and fetch.
 */
export function createImageCache(deps = {}) {
  const {
    openDatabase = defaultOpenDatabase,
    fetchImage = defaultFetchImage,
    createObjectUrl = (blob) => URL.createObjectURL(blob),
    revokeObjectUrl = (url) => URL.revokeObjectURL(url)
  } = deps

  /** Object URLs handed out, so they can be released. */
  const issued = new Map()
  const inFlight = new Map()

  /**
   * A usable src for this render, from the cache when possible.
   *
   * Returns null when nothing is stored and the fetch fails, which lets the
   * caller fall back to pointing the img straight at Tesla.
   *
   * @param {string} url
   * @returns {Promise<string | null>}
   */
  async function resolve(url) {
    if (!url) return null
    if (issued.has(url)) return issued.get(url)
    if (inFlight.has(url)) return inFlight.get(url)

    const work = (async () => {
      let blob = await read(url).catch(() => null)
      if (blob && !usable(blob)) {
        // Something unusable was stored by an earlier version or a bad
        // response; drop it rather than serve it again.
        blob = null
        await drop(url).catch(() => {})
      }
      if (!blob) {
        blob = await fetchImage(url).catch(() => null)
        // Only a real image is worth keeping. A failed write is not worth
        // failing the render over.
        if (blob && usable(blob)) await write(url, blob).catch(() => {})
        if (blob && !usable(blob)) blob = null
      }
      if (!blob) return null
      const objectUrl = createObjectUrl(blob)
      issued.set(url, objectUrl)
      return objectUrl
    })()

    inFlight.set(url, work)
    try {
      return await work
    } finally {
      inFlight.delete(url)
    }
  }

  /**
   * Drop everything except the renders still in use, so the store does not
   * grow every time a colour is tried in the editor.
   *
   * @param {string[]} keep
   */
  async function prune(keep) {
    const wanted = new Set(keep.filter(Boolean))
    for (const [url, objectUrl] of issued) {
      if (!wanted.has(url)) {
        revokeObjectUrl(objectUrl)
        issued.delete(url)
      }
    }
    try {
      const db = await openDatabase()
      if (!db) return
      const keys = await allKeys(db)
      const stale = keys.filter((key) => !wanted.has(key))
      if (stale.length) await remove(db, stale)
    } catch {
      // A cache that cannot be tidied is still a working cache.
    }
  }

  /**
   * Forget one render entirely, so the next resolve goes back to the network.
   * Used when the browser cannot decode what was stored, which would
   * otherwise leave the card permanently blank.
   *
   * @param {string} url
   */
  async function evict(url) {
    const objectUrl = issued.get(url)
    if (objectUrl) {
      revokeObjectUrl(objectUrl)
      issued.delete(url)
    }
    inFlight.delete(url)
    await drop(url).catch(() => {})
  }

  /** Release every object URL. Called when the card leaves the DOM. */
  function release() {
    for (const objectUrl of issued.values()) revokeObjectUrl(objectUrl)
    issued.clear()
  }

  async function read(url) {
    const db = await openDatabase()
    if (!db) return null
    return get(db, url)
  }

  async function drop(url) {
    const db = await openDatabase()
    if (!db) return
    return remove(db, [url])
  }

  async function write(url, blob) {
    const db = await openDatabase()
    if (!db) return
    return put(db, url, blob)
  }

  return { resolve, prune, release, evict }
}

// ---------------------------------------------------------------- IndexedDB

function defaultOpenDatabase() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null)
    let request
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION)
    } catch {
      return resolve(null)
    }
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    // Private browsing and blocked storage both land here.
    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })
}

/**
 * Decide what to do when the browser refuses to display a render.
 *
 * A stored copy that will not decode must be thrown away and fetched again,
 * or the card stays blank for as long as the configuration is unchanged.
 * A fresh copy that fails is a real failure and should be reported.
 *
 * @param {string} shown The src the img was given
 * @param {string | null} remote The canonical URL for this configuration
 * @param {Set<string>} retried Renders already refetched once
 * @returns {'retry' | 'give-up'}
 */
export function imageErrorAction(shown, remote, retried) {
  if (!remote) return 'give-up'
  const wasStoredCopy = shown !== remote
  if (wasStoredCopy && !retried.has(remote)) return 'retry'
  return 'give-up'
}

/**
 * A blob worth storing: an image, and big enough to be a real render rather
 * than an error page that happened to arrive with a 200.
 *
 * @param {{ size?: number, type?: string }} blob
 */
export function usable(blob) {
  if (!blob || typeof blob.size !== 'number') return false
  if (blob.size < MIN_BYTES) return false
  return typeof blob.type === 'string' && blob.type.startsWith('image/')
}

async function defaultFetchImage(url) {
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  if (!response.ok) throw new Error(`image request failed: ${response.status}`)
  // An intercepting proxy can answer 200 with an HTML page. Storing that
  // would poison the cache for this configuration permanently.
  const type = response.headers?.get?.('content-type') ?? ''
  if (!type.startsWith('image/')) throw new Error(`not an image: ${type || 'no content-type'}`)
  return response.blob()
}

function transact(db, mode, run) {
  return new Promise((resolve, reject) => {
    let tx
    try {
      tx = db.transaction(STORE, mode)
    } catch (error) {
      return reject(error)
    }
    const request = run(tx.objectStore(STORE))
    tx.onabort = () => reject(tx.error)
    tx.onerror = () => reject(tx.error)
    if (request) {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    } else {
      tx.oncomplete = () => resolve()
    }
  })
}

const get = (db, key) => transact(db, 'readonly', (store) => store.get(key))
const put = (db, key, value) => transact(db, 'readwrite', (store) => store.put(value, key))
const allKeys = (db) => transact(db, 'readonly', (store) => store.getAllKeys())

function remove(db, keys) {
  return transact(db, 'readwrite', (store) => {
    for (const key of keys) store.delete(key)
    return null
  })
}
