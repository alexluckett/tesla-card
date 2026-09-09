/**
 * Tesla VIN decoding.
 *
 * The Fleet integration puts the full VIN on the device record as
 * `serial_number`, which is enough to work out the model and the model year,
 * and therefore which body generation the configurator should render.
 */

/** VIN character 4 - the vehicle line. */
const MODEL_BY_LINE = {
  S: { model: 'ms', name: 'Model S' },
  X: { model: 'mx', name: 'Model X' },
  3: { model: 'm3', name: 'Model 3' },
  Y: { model: 'my', name: 'Model Y' },
  C: { model: 'ct', name: 'Cybertruck' },
  R: { model: 'mr', name: 'Roadster' },
  T: { model: 'ms', name: 'Semi' },
  A: { model: 'my', name: 'Cybercab' }
}

/** VIN character 10 - model year. I, O, Q, U and Z are never used. */
const YEAR_BY_CODE = {
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026,
  V: 2027,
  W: 2028,
  X: 2029,
  Y: 2030
}

/**
 * First model year of the current body for each line. A car at or after this
 * year renders with the newer code set; anything earlier uses the older one.
 */
const GENERATION_FROM = {
  my: { year: 2025, current: 'juniper', previous: 'legacy' },
  m3: { year: 2024, current: 'highland', previous: 'legacy' },
  ms: { year: 2021, current: 'palladium', previous: 'legacy' },
  mx: { year: 2021, current: 'palladium', previous: 'legacy' }
}

/**
 * Markets that drive on the left side of the road, and therefore fit the
 * steering wheel on the right. Used only to pick a sensible default for the
 * configurator's `$DRRH` flag, which the user can always override.
 */
const RIGHT_HAND_DRIVE = new Set([
  'GB',
  'IE',
  'AU',
  'NZ',
  'JP',
  'IN',
  'ZA',
  'SG',
  'MY',
  'TH',
  'HK',
  'ID',
  'PK',
  'LK',
  'KE',
  'CY',
  'MT'
])

/**
 * Decode what the VIN can tell us. Returns null when the string is not a
 * plausible Tesla VIN, so callers can fall back to the device model name.
 *
 * @param {string | null | undefined} vin
 * @returns {VehicleIdentity | null}
 */
export function decodeVin(vin) {
  if (typeof vin !== 'string') return null
  const raw = vin.trim().toUpperCase()
  if (raw.length !== 17) return null

  const line = MODEL_BY_LINE[raw[3]]
  if (!line) return null

  const year = YEAR_BY_CODE[raw[9]] ?? null
  const generation = generationFor(line.model, year)

  return {
    vin: raw,
    model: line.model,
    name: line.name,
    year,
    generation,
    plant: raw[10] ?? null
  }
}

/**
 * @param {string} model
 * @param {number | null} year
 * @returns {string | null}
 */
export function generationFor(model, year) {
  const rule = GENERATION_FROM[model]
  if (!rule) return null
  if (year === null) return rule.current
  return year >= rule.year ? rule.current : rule.previous
}

/**
 * Work out which side the steering wheel is on from the Home Assistant
 * country setting. The VIN encodes this too, but Tesla's body-type letters
 * are not published in a form worth relying on, so country is the honest
 * default and the card exposes an override.
 *
 * @param {string | null | undefined} country
 * @returns {'rhd' | 'lhd'}
 */
export function driveHandFor(country) {
  if (typeof country !== 'string') return 'lhd'
  return RIGHT_HAND_DRIVE.has(country.toUpperCase()) ? 'rhd' : 'lhd'
}

/**
 * Fall back to the device's model name when there is no usable VIN. The
 * integration sets this from the same VIN character, so it stays consistent.
 *
 * @param {string | null | undefined} deviceModel
 * @returns {VehicleIdentity | null}
 */
export function identityFromModelName(deviceModel) {
  if (typeof deviceModel !== 'string') return null
  const match = Object.values(MODEL_BY_LINE).find(
    (entry) => entry.name.toLowerCase() === deviceModel.trim().toLowerCase()
  )
  if (!match) return null
  return {
    vin: null,
    model: match.model,
    name: match.name,
    year: null,
    generation: generationFor(match.model, null),
    plant: null
  }
}

/**
 * @typedef {object} VehicleIdentity
 * @property {string | null} vin
 * @property {string} model Configurator model key, e.g. `my`
 * @property {string} name Human name, e.g. `Model Y`
 * @property {number | null} year
 * @property {string | null} generation
 * @property {string | null} plant
 */
