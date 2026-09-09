import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { display, normalise, resolvePreference, AUTO, IMPERIAL, METRIC } from '../src/lib/units.js'

const near = (actual, expected, tolerance = 0.5) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `expected roughly ${expected}, got ${actual}`)

describe('display', () => {
  test('auto shows whatever Home Assistant is already showing', () => {
    assert.deepEqual(display(318, 'km', AUTO), { value: 318, unit: 'km' })
    assert.deepEqual(display(198, 'mi', AUTO), { value: 198, unit: 'mi' })
  })

  test('the United Kingdom case: Home Assistant sends km, the card shows miles', () => {
    // HA maps GB to metric, so a Tesla's native miles arrive converted to km.
    const { value, unit } = display(318.6, 'km', IMPERIAL)
    near(value, 198)
    assert.equal(unit, 'mi')
  })

  test('miles to kilometres', () => {
    const { value, unit } = display(198, 'mi', METRIC)
    near(value, 318.6)
    assert.equal(unit, 'km')
  })

  test('leaves a reading alone when it is already in the wanted system', () => {
    assert.deepEqual(display(198, 'mi', IMPERIAL), { value: 198, unit: 'mi' })
    assert.deepEqual(display(318, 'km', METRIC), { value: 318, unit: 'km' })
  })

  test('converts speed with its own units', () => {
    const fast = display(100, 'km/h', IMPERIAL, 'speed')
    near(fast.value, 62.1)
    assert.equal(fast.unit, 'mph')

    const slow = display(38, 'mph', METRIC, 'speed')
    near(slow.value, 61.2)
    assert.equal(slow.unit, 'km/h')
  })

  test('round trips without drifting', () => {
    const there = display(198, 'mi', METRIC)
    const back = display(there.value, there.unit, IMPERIAL)
    near(back.value, 198, 0.001)
  })

  test('passes an unrecognised unit through rather than guessing', () => {
    assert.deepEqual(display(5, 'furlongs', IMPERIAL), { value: 5, unit: 'furlongs' })
  })

  test('handles a missing reading', () => {
    assert.deepEqual(display(null, 'km', IMPERIAL), { value: null, unit: 'km' })
    assert.deepEqual(display(null, null, IMPERIAL), { value: null, unit: null })
  })

  test('a reading with no unit is left alone', () => {
    assert.deepEqual(display(198, null, IMPERIAL), { value: 198, unit: null })
  })
})

describe('normalise', () => {
  test('accepts the spellings Home Assistant and themes produce', () => {
    assert.equal(normalise('mi'), 'mi')
    assert.equal(normalise('Miles'), 'mi')
    assert.equal(normalise('kilometres'), 'km')
    assert.equal(normalise('KM'), 'km')
    assert.equal(normalise('kph'), 'km/h')
    assert.equal(normalise('mi/h'), 'mph')
  })

  test('is null for nothing usable', () => {
    assert.equal(normalise(null), null)
    assert.equal(normalise('  '), null)
    assert.equal(normalise(7), null)
  })
})

describe('resolvePreference', () => {
  test('follows Home Assistant when nothing is configured', () => {
    // Deliberately not country-aware: the card does not override a unit
    // system the user chose, it just offers a way to disagree with it.
    assert.equal(resolvePreference(undefined), AUTO)
    assert.equal(resolvePreference('auto'), AUTO)
    assert.equal(resolvePreference('home_assistant'), AUTO)
  })

  test('an explicit choice is honoured', () => {
    assert.equal(resolvePreference(METRIC), METRIC)
    assert.equal(resolvePreference(IMPERIAL), IMPERIAL)
  })

  test('nonsense falls back to following Home Assistant', () => {
    assert.equal(resolvePreference('furlongs'), AUTO)
    assert.equal(resolvePreference(null), AUTO)
  })
})
