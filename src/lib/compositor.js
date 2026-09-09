/**
 * Tesla configurator image rules.
 *
 * The compositor takes a model key, a view and an option string. Trim, paint,
 * wheels and interior are all required together: leave any one out and the
 * request fails. `$DRRH` is optional and marks a right-hand-drive body.
 *
 * The compositor rejects combinations it cannot render, which makes it its own
 * source of truth. Model Y is mapped from confirmed responses for every entry.
 * Model 3 has one confirmed combination and its remaining paints are inferred
 * from long-standing Tesla codes; each body notes what it knows.
 */

const BASE = 'https://static-assets.tesla.com/configurator/compositor'
const CONTEXT = 'design_studio_2'

/** Views the endpoint serves, in the order the card falls back through them. */
export const VIEWS = ['FRONT34', 'STUD_3QTR', 'SIDE', 'STUD_SIDE', 'REAR34', 'STUD_REAR']

/**
 * Option codes per model and body generation.
 *
 * `trim` is the code used to render the body; it barely changes the exterior,
 * so one representative code per body is enough and the user never has to
 * know their exact factory SKU. `performance` is listed separately only
 * because the larger wheels are refused on any other trim.
 */
export const CATALOGUE = {
  my: {
    juniper: {
      label: 'Model Y (2025 onwards)',
      trim: '$MTY86',
      performanceTrim: '$MTY53',
      interior: '$IPB12',
      performanceInterior: '$IPB14',
      // Swatches are sampled from the rendered bodywork, not guessed from the
      // code name, so the chip matches the paint.
      paints: [
        { id: 'stealth_grey', code: '$PN01', name: 'Stealth Grey', swatch: '#494955' },
        { id: 'pearl_white', code: '$PPSW', name: 'Pearl White', swatch: '#e7e8ec' },
        { id: 'diamond_black', code: '$PBSB', name: 'Diamond Black', swatch: '#262629' },
        { id: 'deep_blue', code: '$PPSB', name: 'Deep Blue Metallic', swatch: '#113683' },
        { id: 'ultra_red', code: '$PR01', name: 'Ultra Red', swatch: '#a7111f' },
        { id: 'quicksilver', code: '$PN00', name: 'Quicksilver', swatch: '#97969f' },
        { id: 'glacier_blue', code: '$PB01', name: 'Glacier Blue', swatch: '#6e84a4' },
        // Renders, but Tesla publish no name for it. Labelled by its colour
        // rather than invented.
        { id: 'navy_pb02', code: '$PB02', name: 'Dark Blue (PB02)', swatch: '#2a3650' }
      ],
      wheels: [
        { id: 'crossflow_19', code: '$WY19P', name: '19" Crossflow' },
        { id: 'helix_20', code: '$WY20B', name: '20" Helix 2.0' },
        { id: 'induction_20', code: '$WY20A', name: '20" Induction' },
        { id: 'performance_21', code: '$WY21A', name: '21" Performance', performanceOnly: true }
      ]
    },
    legacy: {
      label: 'Model Y (2020 to 2024)',
      trim: '$MDLY,$MTY01',
      interior: '$INPB0',
      paints: [
        { id: 'pearl_white', code: '$PPSW', name: 'Pearl White', swatch: '#e7e8ec' },
        { id: 'solid_black', code: '$PBSB', name: 'Solid Black', swatch: '#262629' },
        { id: 'midnight_silver', code: '$PMNG', name: 'Midnight Silver', swatch: '#5b6065' },
        { id: 'deep_blue', code: '$PPSB', name: 'Deep Blue Metallic', swatch: '#113683' },
        { id: 'red_multicoat', code: '$PPMR', name: 'Red Multi-Coat', swatch: '#a51d2c' }
      ],
      wheels: [
        { id: 'gemini_19', code: '$WY19B', name: '19" Gemini' },
        { id: 'induction_20', code: '$WY20P', name: '20" Induction' }
      ]
    }
  },

  m3: {
    // Only the default combination below is confirmed against the endpoint.
    // The other paint codes are long-standing Tesla codes and are very likely
    // right, but treat them as unproven until someone checks.
    legacy: {
      label: 'Model 3',
      trim: '$MDL3,$MT300',
      interior: '$IN3PB',
      paints: [
        { id: 'pearl_white', code: '$PPSW', name: 'Pearl White', swatch: '#e7e8ec' },
        { id: 'solid_black', code: '$PBSB', name: 'Solid Black', swatch: '#262629' },
        { id: 'midnight_silver', code: '$PMNG', name: 'Midnight Silver', swatch: '#5b6065' },
        { id: 'deep_blue', code: '$PPSB', name: 'Deep Blue Metallic', swatch: '#113683' },
        { id: 'red_multicoat', code: '$PPMR', name: 'Red Multi-Coat', swatch: '#a51d2c' }
      ],
      wheels: [{ id: 'aero_18', code: '$W38B', name: '18" Aero' }]
    }
  }
}

/** Paint shown when the user has not chosen one, per body. */
export function defaultPaint(model, generation) {
  return bodyFor(model, generation)?.paints[0]?.id ?? null
}

/** Wheel shown when the user has not chosen one, per body. */
export function defaultWheels(model, generation) {
  return bodyFor(model, generation)?.wheels[0]?.id ?? null
}

/**
 * @param {string} model
 * @param {string | null} generation
 */
export function bodyFor(model, generation) {
  const line = CATALOGUE[model]
  if (!line) return null
  if (generation && line[generation]) return line[generation]
  return Object.values(line)[0] ?? null
}

/** True when the card knows how to build a URL for this vehicle. */
export function isSupported(model, generation) {
  return bodyFor(model, generation) !== null
}

/**
 * Wheels valid for the chosen trim. Larger wheels exist only on Performance,
 * so offering them elsewhere would produce a request the compositor refuses.
 *
 * @param {string} model
 * @param {string | null} generation
 * @param {boolean} performance
 */
export function wheelsFor(model, generation, performance = false) {
  const body = bodyFor(model, generation)
  if (!body) return []
  return body.wheels.filter((wheel) => performance || !wheel.performanceOnly)
}

/** Paints valid for this body. */
export function paintsFor(model, generation) {
  return bodyFor(model, generation)?.paints ?? []
}

/**
 * Build the image URL.
 *
 * @param {object} options
 * @param {string} options.model Configurator model key
 * @param {string | null} [options.generation]
 * @param {string} [options.paint] Paint id from the catalogue
 * @param {string} [options.wheels] Wheel id from the catalogue
 * @param {boolean} [options.performance]
 * @param {'rhd' | 'lhd'} [options.hand]
 * @param {string} [options.view]
 * @param {number} [options.size]
 * @param {string} [options.optionsOverride] Raw option string, wins outright
 * @returns {string | null}
 */
export function imageUrl({
  model,
  generation = null,
  paint,
  wheels,
  performance = false,
  hand = 'lhd',
  view = 'FRONT34',
  size = 1400,
  optionsOverride = null
}) {
  const body = bodyFor(model, generation)
  if (!body) return null

  let optionString
  if (optionsOverride) {
    optionString = optionsOverride
  } else {
    const paintCode = pick(body.paints, paint)?.code ?? body.paints[0].code
    const wheelChoice = pick(body.wheels, wheels)
    // A wheel the chosen trim cannot take would be refused, so fall back.
    const wheelCode =
      wheelChoice && (performance || !wheelChoice.performanceOnly)
        ? wheelChoice.code
        : body.wheels[0].code
    const trim = performance && body.performanceTrim ? body.performanceTrim : body.trim
    const interior =
      performance && body.performanceInterior ? body.performanceInterior : body.interior

    const parts = [trim, paintCode, wheelCode, interior]
    if (hand === 'rhd') parts.push('$DRRH')
    optionString = parts.join(',')
  }

  const params = new URLSearchParams({
    context: CONTEXT,
    model,
    view,
    size: String(size),
    bkba_opt: '1', // transparent PNG; 0 and 2 return an opaque JPEG
    overlay: '0',
    options: optionString
  })
  return `${BASE}?${params.toString()}`
}

/**
 * The compositor frames every vehicle identically for a given view, so the
 * car's real bounds within the frame are a constant. Cropping to them makes
 * the vehicle fill the card instead of floating in transparent space.
 *
 * Measured from the alpha channel of rendered PNGs; stable across models,
 * trims and paints. Values are fractions of the frame, already padded.
 */
export const CROP = {
  FRONT34: { width: 1.613, left: -0.316, top: -0.503, aspect: 2.273 },
  STUD_3QTR: { width: 1.613, left: -0.316, top: -0.503, aspect: 2.273 },
  REAR34: { width: 1.613, left: -0.316, top: -0.503, aspect: 2.273 },
  SIDE: { width: 1.53, left: -0.27, top: -0.47, aspect: 2.5 },
  STUD_SIDE: { width: 1.53, left: -0.27, top: -0.47, aspect: 2.5 },
  STUD_REAR: { width: 1.613, left: -0.316, top: -0.503, aspect: 2.273 }
}

/** @param {string} view */
export function cropFor(view) {
  return CROP[view] ?? CROP.FRONT34
}

function pick(list, id) {
  return list.find((entry) => entry.id === id) ?? null
}
