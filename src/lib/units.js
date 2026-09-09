/**
 * Distance and speed display.
 *
 * Tesla report range, odometer and speed in miles and miles per hour. Those
 * sensors carry a device class, so Home Assistant converts them to whatever
 * unit system is configured — and it maps the United Kingdom to metric, which
 * is right for most things and wrong for road distances.
 *
 * The card reads the unit Home Assistant is displaying and converts from
 * there, so it follows a per-entity override if one is set and can be pinned
 * outright when the unit system disagrees with local habit.
 */

const MILES_PER_KM = 0.621371192
const KM_PER_MILE = 1.609344

const DISTANCE = {
  mi: { to: 'km', factor: KM_PER_MILE },
  km: { to: 'mi', factor: MILES_PER_KM }
}

const SPEED = {
  mph: { to: 'km/h', factor: KM_PER_MILE },
  'km/h': { to: 'mph', factor: MILES_PER_KM }
}

/** What the card was asked to show, regardless of what Home Assistant sends. */
export const AUTO = 'auto'
export const IMPERIAL = 'imperial'
export const METRIC = 'metric'

const IMPERIAL_UNITS = new Set(['mi', 'mph'])
const METRIC_UNITS = new Set(['km', 'km/h'])

/**
 * Settle the preference. The card follows Home Assistant unless it is told
 * otherwise: second-guessing a unit system the user chose deliberately would
 * be worse than showing kilometres to someone who can set `units: imperial`.
 *
 * @param {string | undefined} configured
 */
export function resolvePreference(configured) {
  if (configured === IMPERIAL || configured === METRIC) return configured
  return AUTO
}

/**
 * Convert a reading into the preferred system.
 *
 * Unknown units are passed through untouched: a unit the card does not
 * recognise is more likely to be right than a guess at converting it.
 *
 * @param {number | null} value
 * @param {string | null} unit The unit Home Assistant is displaying
 * @param {string} preference `auto`, `imperial` or `metric`
 * @param {'distance' | 'speed'} kind
 * @returns {{ value: number | null, unit: string | null }}
 */
export function display(value, unit, preference = AUTO, kind = 'distance') {
  const normalised = normalise(unit)
  if (value === null || value === undefined) return { value: null, unit: normalised }
  if (preference === AUTO || !normalised) return { value, unit: normalised }

  const wanted = preference === IMPERIAL ? IMPERIAL_UNITS : METRIC_UNITS
  if (wanted.has(normalised)) return { value, unit: normalised }

  const table = kind === 'speed' ? SPEED : DISTANCE
  const rule = table[normalised]
  if (!rule) return { value, unit: normalised }

  return { value: value * rule.factor, unit: rule.to }
}

/**
 * Home Assistant is not entirely consistent about how it spells these, and a
 * theme or translation can pass through something with different casing.
 *
 * @param {string | null | undefined} unit
 */
export function normalise(unit) {
  if (typeof unit !== 'string') return null
  const trimmed = unit.trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()
  if (lower === 'mi' || lower === 'miles' || lower === 'mile') return 'mi'
  if (lower === 'km' || lower === 'kilometers' || lower === 'kilometres') return 'km'
  if (lower === 'mph' || lower === 'mi/h') return 'mph'
  if (lower === 'km/h' || lower === 'kph' || lower === 'kmh') return 'km/h'
  return trimmed
}
