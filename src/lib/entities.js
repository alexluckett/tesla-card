/**
 * Resolving the vehicle's entities.
 *
 * The entity registry carries the integration's own `translation_key` for
 * every entity, so the card looks entities up by that rather than by entity
 * id. Renaming a sensor in Home Assistant therefore leaves the card working.
 */

export const PLATFORM = 'tesla_fleet'

/** Translation keys the card reads, by the name it uses internally. */
export const KEYS = {
  battery: 'charge_state_battery_level',
  batteryUsable: 'charge_state_usable_battery_level',
  range: 'charge_state_battery_range',
  rangeEstimated: 'charge_state_est_battery_range',
  chargingState: 'charge_state_charging_state',
  chargerPower: 'charge_state_charger_power',
  chargeLimit: 'charge_state_charge_limit_soc',
  timeToFull: 'charge_state_minutes_to_full_charge',
  cableConnected: 'charge_state_conn_charge_cable',
  speed: 'drive_state_speed',
  shiftState: 'drive_state_shift_state',
  odometer: 'vehicle_state_odometer',
  insideTemp: 'climate_state_inside_temp',
  outsideTemp: 'climate_state_outside_temp',
  online: 'state',
  locked: 'vehicle_state_locked',
  location: 'location',
  route: 'route',
  destination: 'drive_state_active_route_destination',
  arrivalTime: 'drive_state_active_route_minutes_to_arrival',
  distanceToArrival: 'drive_state_active_route_miles_to_arrival',
  chargeAtArrival: 'drive_state_active_route_energy_at_arrival',
  sentry: 'vehicle_state_sentry_mode',
  climate: 'driver_temp',
  frunk: 'vehicle_state_ft',
  trunk: 'vehicle_state_rt',
  windows: 'windows',
  wake: 'wake'
}

/**
 * Entities that the integration creates but leaves disabled. When one of
 * these is missing the card can tell the user exactly what to switch on,
 * rather than silently dropping the feature.
 */
export const DISABLED_BY_DEFAULT = new Set([KEYS.destination, KEYS.chargeAtArrival])

/**
 * Map every Tesla Fleet entity on a device to the card's own names.
 *
 * @param {object} hass
 * @param {string} deviceId
 * @returns {Record<string, string>} card name to entity id
 */
export function resolveEntities(hass, deviceId) {
  const found = {}
  if (!hass?.entities || !deviceId) return found

  const byKey = new Map(Object.entries(KEYS).map(([name, key]) => [key, name]))

  for (const entry of Object.values(hass.entities)) {
    if (entry.device_id !== deviceId) continue
    if (entry.platform !== PLATFORM) continue
    const name = byKey.get(entry.translation_key)
    if (name) found[name] = entry.entity_id
  }
  return found
}

/**
 * Find the vehicle devices this integration provides, so the card can pick
 * one on its own when the user drops it in without configuring anything.
 *
 * @param {object} hass
 * @returns {string[]} device ids
 */
export function teslaVehicleDevices(hass) {
  if (!hass?.entities || !hass?.devices) return []
  const ids = new Set()
  for (const entry of Object.values(hass.entities)) {
    if (entry.platform !== PLATFORM) continue
    if (!entry.device_id) continue
    // Energy sites and wall connectors share the platform but are not cars.
    if (entry.translation_key === KEYS.battery) ids.add(entry.device_id)
  }
  return [...ids].filter((id) => hass.devices[id])
}

/**
 * Read a state object, treating Home Assistant's absent values as absent.
 *
 * @param {object} hass
 * @param {string | undefined} entityId
 */
export function stateOf(hass, entityId) {
  if (!entityId) return null
  const state = hass?.states?.[entityId]
  if (!state) return null
  if (state.state === 'unavailable' || state.state === 'unknown') return null
  return state
}

/**
 * A numeric state, or null when it is missing or not a number.
 *
 * @param {object} hass
 * @param {string | undefined} entityId
 */
export function numberOf(hass, entityId) {
  const state = stateOf(hass, entityId)
  if (!state) return null
  const value = Number(state.state)
  return Number.isFinite(value) ? value : null
}

/**
 * The unit Home Assistant is displaying this entity in. Read rather than
 * assumed, so miles and kilometres both come out right.
 *
 * @param {object} hass
 * @param {string | undefined} entityId
 */
export function unitOf(hass, entityId) {
  return hass?.states?.[entityId]?.attributes?.unit_of_measurement ?? null
}

/**
 * When the vehicle last told us anything.
 *
 * A single sensor's `last_updated` only moves when its value changes, so a
 * battery sitting at 71% looks hours old while polling is perfectly healthy.
 * The freshest timestamp across the whole set is the honest answer.
 *
 * @param {object} hass
 * @param {Record<string, string>} entities
 * @returns {Date | null}
 */
export function lastUpdated(hass, entities) {
  let newest = null
  for (const entityId of Object.values(entities)) {
    const raw = hass?.states?.[entityId]?.last_updated
    if (!raw) continue
    const when = new Date(raw)
    if (Number.isNaN(when.getTime())) continue
    if (!newest || when > newest) newest = when
  }
  return newest
}
