/**
 * Turning entity states into the one thing the card is showing.
 *
 * At a ten-minute poll the vehicle is asleep far more often than it is
 * moving, so asleep is a first-class state here rather than an error case.
 */

import { numberOf, stateOf, unitOf } from './entities.js'

export const ASLEEP = 'asleep'
export const PARKED = 'parked'
export const CHARGING = 'charging'
export const DRIVING = 'driving'

const CHARGING_STATES = new Set(['charging', 'starting'])
const MOVING_SHIFTS = new Set(['d', 'r', 'n'])

/**
 * @param {object} hass
 * @param {Record<string, string>} entities
 * @returns {VehicleState}
 */
export function readVehicle(hass, entities) {
  const battery = numberOf(hass, entities.battery) ?? numberOf(hass, entities.batteryUsable)
  const speed = numberOf(hass, entities.speed)
  const shift = stateOf(hass, entities.shiftState)?.state ?? null
  const chargingRaw = stateOf(hass, entities.chargingState)?.state ?? null
  // `unavailable` means the integration cannot reach the car, which is not
  // the same as the car being asleep, so stateOf filters it to null.
  const onlineState = stateOf(hass, entities.online)?.state ?? null

  const charging = CHARGING_STATES.has(chargingRaw)
  // Tesla reports no shift state at all when parked, and speed only while moving.
  const moving = MOVING_SHIFTS.has(shift ?? '') || (speed !== null && speed > 0)
  const awake = onlineState === 'on'

  let status
  if (moving) status = DRIVING
  else if (charging) status = CHARGING
  else if (!awake && onlineState !== null) status = ASLEEP
  else status = PARKED

  const route = readRoute(hass, entities)

  return {
    status,
    battery,
    range: numberOf(hass, entities.range) ?? numberOf(hass, entities.rangeEstimated),
    rangeUnit: unitOf(hass, entities.range) ?? unitOf(hass, entities.rangeEstimated),
    speed,
    speedUnit: unitOf(hass, entities.speed),
    chargeLimit: numberOf(hass, entities.chargeLimit),
    chargerPower: numberOf(hass, entities.chargerPower),
    timeToFull: stateOf(hass, entities.timeToFull)?.state ?? null,
    locked: readLock(hass, entities),
    zone: readZone(hass, entities),
    route
  }
}

/**
 * The navigation readout. Keyed on a route existing, not on the car moving,
 * so setting a destination on the driveway shows it straight away.
 */
function readRoute(hass, entities) {
  const arrival = stateOf(hass, entities.arrivalTime)?.state ?? null
  const distance = numberOf(hass, entities.distanceToArrival)
  if (!arrival && distance === null) return null

  return {
    destination: stateOf(hass, entities.destination)?.state ?? null,
    // Disabled by default in the integration; the card says so rather than
    // quietly dropping the name.
    destinationAvailable: Boolean(entities.destination),
    arrival,
    distance,
    distanceUnit: unitOf(hass, entities.distanceToArrival),
    chargeAtArrival: numberOf(hass, entities.chargeAtArrival)
  }
}

function readLock(hass, entities) {
  const state = stateOf(hass, entities.locked)
  if (!state) return null
  return state.state === 'locked'
}

/**
 * The zone name, when Home Assistant happens to have one. The integration
 * reports only coordinates, so this is a convenience rather than the way the
 * card knows where the car is.
 */
function readZone(hass, entities) {
  const state = stateOf(hass, entities.location)
  if (!state) return null
  const value = state.state
  if (value === 'not_home') return null
  if (value === 'home') return 'Home'
  // A zone name arrives already capitalised; anything else is a raw value.
  return value
}

/**
 * How stale the reading is, in whole minutes, or null when unknown.
 *
 * @param {Date | null} when
 * @param {Date} [now]
 */
export function minutesSince(when, now = new Date()) {
  if (!when) return null
  const diff = Math.floor((now.getTime() - when.getTime()) / 60000)
  return diff < 0 ? 0 : diff
}

/**
 * A short, honest age string.
 *
 * @param {number | null} minutes
 */
export function formatAge(minutes) {
  if (minutes === null) return null
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? '1 hr ago' : `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

/**
 * @typedef {object} VehicleState
 * @property {string} status
 * @property {number | null} battery
 * @property {number | null} range
 * @property {string | null} rangeUnit
 * @property {number | null} speed
 * @property {string | null} speedUnit
 * @property {number | null} chargeLimit
 * @property {number | null} chargerPower
 * @property {string | null} timeToFull
 * @property {boolean | null} locked
 * @property {string | null} zone
 * @property {RouteState | null} route
 */

/**
 * @typedef {object} RouteState
 * @property {string | null} destination
 * @property {boolean} destinationAvailable
 * @property {string | null} arrival
 * @property {number | null} distance
 * @property {string | null} distanceUnit
 * @property {number | null} chargeAtArrival
 */
