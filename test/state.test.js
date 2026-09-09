import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  readVehicle,
  minutesSince,
  formatAge,
  ASLEEP,
  PARKED,
  CHARGING,
  DRIVING
} from '../src/lib/state.js'
import { resolveEntities, lastUpdated, teslaVehicleDevices, KEYS } from '../src/lib/entities.js'

const DEVICE = 'dev_my'

/** Build a hass double from card-name -> {state, attributes, last_updated}. */
function fakeHass(values, { deviceId = DEVICE, platform = 'tesla_fleet' } = {}) {
  const entities = {}
  const states = {}
  for (const [name, data] of Object.entries(values)) {
    const key = KEYS[name]
    const entityId = `sensor.model_y_${name}`
    entities[entityId] = {
      entity_id: entityId,
      device_id: deviceId,
      platform,
      translation_key: key
    }
    states[entityId] = {
      entity_id: entityId,
      state: data.state,
      attributes: data.attributes ?? {},
      last_updated: data.last_updated ?? '2026-09-09T12:00:00Z'
    }
  }
  return {
    entities,
    states,
    devices: { [deviceId]: { id: deviceId, model: 'Model Y', serial_number: '7SAYGDEF9TA123456' } }
  }
}

const parked = {
  battery: { state: '71' },
  range: { state: '198', attributes: { unit_of_measurement: 'mi' } },
  chargingState: { state: 'disconnected' },
  shiftState: { state: 'p' },
  speed: { state: 'unknown' },
  online: { state: 'on' },
  locked: { state: 'locked' },
  location: { state: 'home' },
  chargeLimit: { state: '80' }
}

describe('readVehicle status', () => {
  test('parked when awake and not moving', () => {
    const hass = fakeHass(parked)
    const v = readVehicle(hass, resolveEntities(hass, DEVICE))
    assert.equal(v.status, PARKED)
    assert.equal(v.battery, 71)
    assert.equal(v.range, 198)
    assert.equal(v.rangeUnit, 'mi')
    assert.equal(v.locked, true)
    assert.equal(v.zone, 'Home')
  })

  test('asleep when the online sensor is off', () => {
    const hass = fakeHass({ ...parked, online: { state: 'off' } })
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).status, ASLEEP)
  })

  test('charging beats parked', () => {
    const hass = fakeHass({ ...parked, chargingState: { state: 'charging' } })
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).status, CHARGING)
  })

  test('driving beats charging', () => {
    const hass = fakeHass({
      ...parked,
      chargingState: { state: 'charging' },
      shiftState: { state: 'd' },
      speed: { state: '38', attributes: { unit_of_measurement: 'mph' } }
    })
    const v = readVehicle(hass, resolveEntities(hass, DEVICE))
    assert.equal(v.status, DRIVING)
    assert.equal(v.speed, 38)
    assert.equal(v.speedUnit, 'mph')
  })

  test('a speed above zero counts as moving even with no shift state', () => {
    const hass = fakeHass({ ...parked, shiftState: { state: 'unknown' }, speed: { state: '12' } })
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).status, DRIVING)
  })

  test('reads units rather than assuming miles', () => {
    const hass = fakeHass({
      ...parked,
      range: { state: '318', attributes: { unit_of_measurement: 'km' } }
    })
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).rangeUnit, 'km')
  })

  test('treats unavailable and unknown as absent', () => {
    const hass = fakeHass({
      ...parked,
      battery: { state: 'unavailable' },
      range: { state: 'unknown' }
    })
    const v = readVehicle(hass, resolveEntities(hass, DEVICE))
    assert.equal(v.battery, null)
    assert.equal(v.range, null)
  })

  test('an unreachable integration is not reported as asleep', () => {
    // Every entity unavailable means the integration is broken, not that the
    // car is sleeping. Claiming "Asleep" there would be a lie.
    const hass = fakeHass(
      Object.fromEntries(Object.keys(parked).map((k) => [k, { state: 'unavailable' }]))
    )
    const v = readVehicle(hass, resolveEntities(hass, DEVICE))
    assert.notEqual(v.status, ASLEEP)
    assert.equal(v.status, PARKED)
    assert.equal(v.battery, null)
  })

  test('no zone when the car is away from every zone', () => {
    const hass = fakeHass({ ...parked, location: { state: 'not_home' } })
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).zone, null)
  })
})

describe('route', () => {
  test('is absent with no navigation set', () => {
    const hass = fakeHass(parked)
    assert.equal(readVehicle(hass, resolveEntities(hass, DEVICE)).route, null)
  })

  test('appears while parked, not only while driving', () => {
    const hass = fakeHass({
      ...parked,
      arrivalTime: { state: '2026-09-09T14:32:00Z' },
      distanceToArrival: { state: '23', attributes: { unit_of_measurement: 'mi' } },
      destination: { state: 'Home' }
    })
    const v = readVehicle(hass, resolveEntities(hass, DEVICE))
    assert.equal(v.status, PARKED, 'still parked')
    assert.ok(v.route, 'but the route is readable')
    assert.equal(v.route.destination, 'Home')
    assert.equal(v.route.distance, 23)
    assert.equal(v.route.destinationEntityMissing, false)
  })

  test('works without the destination sensor, which ships disabled', () => {
    const hass = fakeHass({
      ...parked,
      arrivalTime: { state: '2026-09-09T14:32:00Z' },
      distanceToArrival: { state: '23' }
    })
    const route = readVehicle(hass, resolveEntities(hass, DEVICE)).route
    assert.ok(route)
    assert.equal(route.destination, null)
    assert.equal(
      route.destinationEntityMissing,
      true,
      'the card can then say which entity to enable'
    )
  })
})

describe('resolveEntities', () => {
  test('matches on translation key, so renaming an entity does not break it', () => {
    const hass = fakeHass(parked)
    const renamed = 'sensor.the_car_soc'
    const original = 'sensor.model_y_battery'
    hass.entities[renamed] = { ...hass.entities[original], entity_id: renamed }
    hass.states[renamed] = { ...hass.states[original], entity_id: renamed, state: '55' }
    delete hass.entities[original]
    delete hass.states[original]

    const found = resolveEntities(hass, DEVICE)
    assert.equal(found.battery, renamed)
    assert.equal(readVehicle(hass, found).battery, 55)
  })

  test('ignores other devices and other integrations', () => {
    const hass = fakeHass(parked)
    assert.deepEqual(resolveEntities(hass, 'someone_elses_device'), {})
    const foreign = fakeHass(parked, { platform: 'demo' })
    assert.deepEqual(resolveEntities(foreign, DEVICE), {})
  })

  test('survives a hass with nothing in it', () => {
    assert.deepEqual(resolveEntities({}, DEVICE), {})
    assert.deepEqual(resolveEntities(null, DEVICE), {})
  })
})

describe('teslaVehicleDevices', () => {
  test('finds the car so the card can configure itself', () => {
    assert.deepEqual(teslaVehicleDevices(fakeHass(parked)), [DEVICE])
  })

  test('ignores platform entities that are not vehicles', () => {
    const hass = fakeHass(parked)
    for (const id of Object.keys(hass.entities)) {
      hass.entities[id].translation_key = 'solar_power'
    }
    assert.deepEqual(teslaVehicleDevices(hass), [])
  })
})

describe('staleness', () => {
  test('takes the freshest entity, not one that happens to be stable', () => {
    // A battery parked at 71% has an old last_updated even while polling works.
    const hass = fakeHass({
      ...parked,
      battery: { state: '71', last_updated: '2026-09-09T09:00:00Z' },
      range: { state: '198', last_updated: '2026-09-09T11:56:00Z' }
    })
    const when = lastUpdated(hass, resolveEntities(hass, DEVICE))
    assert.equal(when.toISOString(), '2026-09-09T12:00:00.000Z')
  })

  test('null when nothing has ever reported', () => {
    assert.equal(lastUpdated({ states: {} }, {}), null)
  })

  test('minutesSince never goes negative on clock skew', () => {
    const future = new Date('2026-09-09T12:10:00Z')
    assert.equal(minutesSince(future, new Date('2026-09-09T12:00:00Z')), 0)
  })
})

describe('formatAge', () => {
  test('reads naturally across the ranges', () => {
    assert.equal(formatAge(0), 'just now')
    assert.equal(formatAge(4), '4 min ago')
    assert.equal(formatAge(60), '1 hr ago')
    assert.equal(formatAge(150), '2 hrs ago')
    assert.equal(formatAge(1440), '1 day ago')
    assert.equal(formatAge(null), null)
  })
})
