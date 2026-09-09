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
