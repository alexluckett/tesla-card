/**
 * Reading the card's own configuration.
 */

export const MAP_NEVER = 'never'
export const MAP_NAVIGATING = 'navigating'
export const MAP_ALWAYS = 'always'

/**
 * When to draw the map.
 *
 * Booleans are accepted because the option started as one, so a dashboard
 * written against the earlier shape keeps working: `true` meant "while
 * navigating", which is still the default.
 *
 * @param {unknown} value
 * @returns {'never' | 'navigating' | 'always'}
 */
export function mapMode(value) {
  if (value === false || value === MAP_NEVER) return MAP_NEVER
  if (value === MAP_ALWAYS) return MAP_ALWAYS
  return MAP_NAVIGATING
}

/**
 * Whether the map belongs on the card as things stand.
 *
 * A map needs somewhere to put the car, so it never appears without a
 * position however it is configured.
 *
 * @param {string} mode
 * @param {boolean} hasRoute
 * @param {boolean} hasPosition
 */
export function shouldShowMap(mode, hasRoute, hasPosition) {
  if (!hasPosition || mode === MAP_NEVER) return false
  return mode === MAP_ALWAYS || hasRoute
}
