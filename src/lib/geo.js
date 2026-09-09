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

/** Dash and gap. Their sum is the distance one full cycle travels. */
export const DASH = [5, 7]

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
    weight: 2,
    opacity: 0.85,
    dashArray: DASH.join(' '),
    interactive: false
  })
}

/** How far along the line the arrowhead sits, clear of both markers. */
const ARROW_AT = 0.66
/** Barb length as a fraction of the line, so it scales with the journey. */
const ARROW_SIZE = 0.07
/** Half the angle between the barbs. */
const ARROW_SPREAD = 0.46

/**
 * The two coordinates of an arrowhead pointing along a bearing.
 *
 * Longitude degrees are shorter than latitude degrees everywhere but the
 * equator, so the direction is worked out in a flattened space scaled by the
 * cosine of the latitude and converted back afterwards. Without that the
 * arrow leans, and the further north you drive the worse it leans.
 *
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @returns {[number, number][] | null} barb, tip, barb
 */
export function arrowPoints(from, to) {
  if (!from || !to) return null
  const [lat1, lon1] = from
  const [lat2, lon2] = to

  const kx = Math.cos((((lat1 + lat2) / 2) * Math.PI) / 180) || 1
  const dx = (lon2 - lon1) * kx
  const dy = lat2 - lat1
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  const heading = Math.atan2(dy, dx)
  const tip = [lat1 + dy * ARROW_AT, lon1 + (lon2 - lon1) * ARROW_AT]
  const barb = length * ARROW_SIZE

  // Both barbs point back down the line, so the shape reads as an arrowhead
  // rather than a cross.
  const back = (spread) => [
    tip[0] + barb * Math.sin(heading + Math.PI + spread),
    tip[1] + (barb * Math.cos(heading + Math.PI + spread)) / kx
  ]

  return [back(-ARROW_SPREAD), tip, back(ARROW_SPREAD)]
}

/**
 * The arrowhead as a Leaflet layer, showing which way the car is heading
 * along the bearing.
 *
 * @param {object | null} leaflet
 * @param {[number, number] | null} from
 * @param {[number, number] | null} to
 * @param {string} color
 */
export function bearingArrow(leaflet, from, to, color) {
  if (!leaflet || typeof leaflet.polyline !== 'function') return null
  const points = arrowPoints(from, to)
  if (!points) return null
  return leaflet.polyline(points, {
    color,
    weight: 1.8,
    opacity: 0.75,
    lineCap: 'round',
    lineJoin: 'round',
    interactive: false
  })
}

/**
 * Send the dashes travelling towards the destination.
 *
 * Leaflet draws a polyline as an SVG path inside the map's own shadow root,
 * where this card's stylesheet cannot reach. The Web Animations API works on
 * the element directly, so it needs no stylesheet at all.
 *
 * Shifting the offset by exactly one dash cycle makes the loop seamless.
 *
 * @param {SVGElement | null | undefined} element
 * @param {boolean} reduceMotion
 * @returns {Animation | null}
 */
export function driftDashes(element, reduceMotion = false) {
  if (!element || reduceMotion) return null
  if (typeof element.animate !== 'function') return null
  const cycle = DASH[0] + DASH[1]
  return element.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -cycle }], {
    duration: 900,
    iterations: Infinity,
    easing: 'linear'
  })
}
