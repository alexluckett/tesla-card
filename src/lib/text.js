/**
 * Presenting the destination the car reports.
 *
 * Tesla give whatever the navigation is set to, which is a place name for a
 * point of interest and a full postal address otherwise. An address is too
 * long for a card, and cutting it with an ellipsis loses the postcode while
 * keeping the house number, which helps nobody.
 */

/** Longer than this and an address is worth reducing to its first part. */
const COMFORTABLE = 26

/**
 * The most identifying part of a destination.
 *
 * Addresses arrive comma separated, most specific first, so the first segment
 * is the part a person recognises: `42 Kingsway Avenue` rather than
 * `42 Kingsway Avenue, Farnborough, Hampshire GU14 7QR`.
 *
 * @param {string | null | undefined} name
 * @param {number} [comfortable]
 * @returns {string | null}
 */
export function shortenPlace(name, comfortable = COMFORTABLE) {
  if (typeof name !== 'string') return null
  const trimmed = name.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  if (trimmed.length <= comfortable) return trimmed

  const first = trimmed.split(',')[0].trim()
  // Only worth it if the first part is actually shorter and still says
  // something; otherwise keep the whole name and let the card ellipsis it.
  if (first && first.length < trimmed.length) return first
  return trimmed
}

/**
 * How long until the car arrives, as a person would say it.
 *
 * Returns null when the arrival is now or already past, so the card falls
 * back to naming the destination without a stale countdown beside it.
 *
 * @param {string | null | undefined} iso Timestamp from the arrival sensor
 * @param {Date} [now]
 * @returns {string | null}
 */
export function arrivalIn(iso, now = new Date()) {
  if (typeof iso !== 'string' || !iso) return null
  const at = new Date(iso)
  if (Number.isNaN(at.getTime())) return null

  const minutes = Math.round((at.getTime() - now.getTime()) / 60000)
  if (minutes < 1) return null
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`
}
