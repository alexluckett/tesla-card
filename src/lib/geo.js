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
