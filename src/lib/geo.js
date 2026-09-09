/**
 * Positions for the map.
 *
 * The location and route trackers carry latitude and longitude as attributes.
 * Both are needed to draw the line from where the car is to where it is
 * going.
 */

/**
 * Coordinates from a device tracker, or null when it has none.
 *
 * @param {object} hass
 * @param {string | undefined} entityId
 * @returns {[number, number] | null}
 */
export function coordsOf(hass, entityId) {
  if (!entityId) return null
  const attributes = hass?.states?.[entityId]?.attributes
  if (!attributes) return null
  const { latitude, longitude } = attributes
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return [latitude, longitude]
}

/**
 * A straight line from the car to its destination.
 *
 * This is the direct bearing, not the road route: Tesla publish the
 * destination and the distance but no geometry, so there is nothing to draw a
 * real route from. It is deliberately a different colour from the history
 * trail so the two never read as the same thing.
 *
 * Home Assistant's map takes only points and a colour for a path, with no
 * dash option, so the distinction has to be carried by colour alone.
 *
 * @param {[number, number] | null} from
 * @param {[number, number] | null} to
 * @param {string} color
 * @returns {object | null}
 */
export function bearingPath(from, to, color) {
  if (!from || !to) return null
  if (from[0] === to[0] && from[1] === to[1]) return null
  const now = new Date()
  return {
    points: [
      { point: from, timestamp: now },
      { point: to, timestamp: now }
    ],
    color,
    name: 'Direct line to destination'
  }
}

/**
 * The current journey, out of everything the recorder holds.
 *
 * Home Assistant's history covers a fixed window, so a two hour window can
 * contain this morning's drive to the shops as well as the one happening now.
 * Drawn as one path they join into a line the car never took.
 *
 * While a vehicle is awake it is polled every few minutes, and it only stops
 * being polled once it has been asleep a while. A long gap between fixes
 * therefore means the car was parked, which is the end of a journey.
 *
 * @param {{point: [number, number], timestamp: Date}[]} points Oldest first
 * @param {number} [gapMs] Silence that counts as a journey ending
 * @returns {{point: [number, number], timestamp: Date}[]}
 */
export function currentJourney(points, gapMs = 25 * 60 * 1000) {
  if (!Array.isArray(points) || points.length < 2) return []

  const ordered = points
    .filter((p) => p?.timestamp instanceof Date && !Number.isNaN(p.timestamp.getTime()))
    .sort((a, b) => a.timestamp - b.timestamp)
  if (ordered.length < 2) return []

  let start = 0
  for (let i = ordered.length - 1; i > 0; i--) {
    if (ordered[i].timestamp - ordered[i - 1].timestamp > gapMs) {
      start = i
      break
    }
  }

  const journey = ordered.slice(start)
  // A single fix is a dot, not a path, and drawing one is just noise.
  return journey.length >= 2 ? journey : []
}

/**
 * A dashed line from the car to its destination, as a Leaflet layer.
 *
 * Home Assistant's `paths` API takes points and a colour and nothing else, so
 * a path drawn through it can only ever be solid. Its `layers` property, on
 * the other hand, adds any Leaflet layer straight to the map, which does
 * support a dash. That is the only way to make the bearing visually distinct
 * from the trail rather than merely a different colour.
 *
 * Returns null when Leaflet is not reachable, so the caller can fall back to
 * a solid path instead of losing the line altogether.
 *
 * @param {object | null} leaflet The Leaflet module, from the map element
 * @param {[number, number] | null} from
 * @param {[number, number] | null} to
 * @param {string} color
 */
export function bearingLayer(leaflet, from, to, color) {
  if (!leaflet || typeof leaflet.polyline !== 'function') return null
  if (!from || !to) return null
  if (from[0] === to[0] && from[1] === to[1]) return null
  return leaflet.polyline([from, to], {
    color,
    weight: 2.5,
    opacity: 0.9,
    dashArray: '6 7',
    interactive: false
  })
}
