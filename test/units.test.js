import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  display,
  normalise,
  preferenceForCountry,
  resolvePreference,
  AUTO,
  IMPERIAL,
  METRIC
} from '../src/lib/units.js'

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

describe('choosing a default', () => {
  test('the United Kingdom drives in miles even though it is otherwise metric', () => {
    // This is the whole point: Home Assistant maps GB to metric, which is
    // right for the weather and wrong for how far the car can go.
    assert.equal(preferenceForCountry('GB'), IMPERIAL)
    assert.equal(preferenceForCountry('gb'), IMPERIAL)
  })

  test('the Crown dependencies drive in miles too', () => {
    for (const country of ['IM', 'JE', 'GG']) {
      assert.equal(preferenceForCountry(country), IMPERIAL, country)
    }
  })

  test('everywhere else keeps whatever Home Assistant decided', () => {
    for (const country of ['DE', 'FR', 'NL', 'AU', 'NO']) {
      assert.equal(preferenceForCountry(country), AUTO, country)
    }
  })

  test('no country set means no opinion', () => {
    assert.equal(preferenceForCountry(null), AUTO)
    assert.equal(preferenceForCountry(undefined), AUTO)
  })
})

describe('resolvePreference', () => {
  test('an explicit choice beats the country', () => {
    assert.equal(resolvePreference(METRIC, 'GB'), METRIC)
    assert.equal(resolvePreference(IMPERIAL, 'DE'), IMPERIAL)
  })

  test('asking for Home Assistant is honoured even in a miles country', () => {
    assert.equal(resolvePreference('home_assistant', 'GB'), AUTO)
  })

  test('no choice falls back to the country', () => {
    assert.equal(resolvePreference(undefined, 'GB'), IMPERIAL)
    assert.equal(resolvePreference(undefined, 'DE'), AUTO)
  })
})
