/**
 * Resolving the vehicle's entities.
 *
 * The entity registry carries the integration's own `translation_key` for
 * every entity, so the card looks entities up by that rather than by entity
 * id. Renaming a sensor in Home Assistant therefore leaves the card working.
 */

export const PLATFORM = 'tesla_fleet'

/**
 * The entities the card reads, as `domain:translation_key`.
 *
 * The domain is part of the identity, not decoration: the integration reuses
 * a translation key across platforms. `charge_state_charging_state` is both
 * the charging sensor and the charge switch, and `charge_state_conn_charge_cable`
 * is both a sensor and a binary sensor. Matching on the key alone picked
 * whichever happened to come first.
 */
export const KEYS = {
  battery: 'sensor:charge_state_battery_level',
  batteryUsable: 'sensor:charge_state_usable_battery_level',
  range: 'sensor:charge_state_battery_range',
  rangeEstimated: 'sensor:charge_state_est_battery_range',
  chargingState: 'sensor:charge_state_charging_state',
  chargerPower: 'sensor:charge_state_charger_power',
  chargeLimit: 'number:charge_state_charge_limit_soc',
  timeToFull: 'sensor:charge_state_minutes_to_full_charge',
  cableConnected: 'binary_sensor:charge_state_conn_charge_cable',
  speed: 'sensor:drive_state_speed',
  shiftState: 'sensor:drive_state_shift_state',
  odometer: 'sensor:vehicle_state_odometer',
  insideTemp: 'sensor:climate_state_inside_temp',
  outsideTemp: 'sensor:climate_state_outside_temp',
  online: 'binary_sensor:state',
  locked: 'lock:vehicle_state_locked',
  location: 'device_tracker:location',
  route: 'device_tracker:route',
  destination: 'sensor:drive_state_active_route_destination',
  arrivalTime: 'sensor:drive_state_active_route_minutes_to_arrival',
  distanceToArrival: 'sensor:drive_state_active_route_miles_to_arrival',
  chargeAtArrival: 'sensor:drive_state_active_route_energy_at_arrival',

  // Controls. The charge switch deliberately shares its translation key with
  // the charging sensor above, which is exactly why the domain matters.
  chargeSwitch: 'switch:charge_state_charging_state',
  sentry: 'switch:vehicle_state_sentry_mode',
  climate: 'climate:driver_temp',
  frunk: 'cover:vehicle_state_ft',
  trunk: 'cover:vehicle_state_rt',
  windows: 'cover:windows',
  wake: 'button:wake'
}

/**
 * Entities that the integration creates but leaves disabled. When one of
 * these is missing the card can tell the user exactly what to switch on,
 * rather than silently dropping the feature.
 */
export const DISABLED_BY_DEFAULT = new Set([KEYS.destination, KEYS.chargeAtArrival])

/** The part of an entity id before the dot. */
export function domainOf(entityId) {
  const dot = typeof entityId === 'string' ? entityId.indexOf('.') : -1
  return dot > 0 ? entityId.slice(0, dot) : null
}

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
    const name = byKey.get(`${domainOf(entry.entity_id)}:${entry.translation_key}`)
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
    if (`${domainOf(entry.entity_id)}:${entry.translation_key}` === KEYS.battery) {
      ids.add(entry.device_id)
    }
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
