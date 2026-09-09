import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mapMode, shouldShowMap, MAP_ALWAYS, MAP_NAVIGATING, MAP_NEVER } from '../src/lib/config.js'

describe('mapMode', () => {
  test('reads the three settings', () => {
    assert.equal(mapMode('always'), MAP_ALWAYS)
    assert.equal(mapMode('navigating'), MAP_NAVIGATING)
    assert.equal(mapMode('never'), MAP_NEVER)
  })

  test('still understands the boolean it used to be', () => {
    // A dashboard written against the earlier option must keep working.
    assert.equal(mapMode(true), MAP_NAVIGATING)
    assert.equal(mapMode(false), MAP_NEVER)
  })

  test('defaults to showing it while navigating', () => {
    assert.equal(mapMode(undefined), MAP_NAVIGATING)
    assert.equal(mapMode('nonsense'), MAP_NAVIGATING)
  })
})

describe('shouldShowMap', () => {
  test('always means parked too', () => {
    assert.equal(shouldShowMap(MAP_ALWAYS, false, true), true)
    assert.equal(shouldShowMap(MAP_ALWAYS, true, true), true)
  })

  test('navigating means only while a route is set', () => {
    assert.equal(shouldShowMap(MAP_NAVIGATING, true, true), true)
    assert.equal(shouldShowMap(MAP_NAVIGATING, false, true), false)
  })

  test('never means never', () => {
    assert.equal(shouldShowMap(MAP_NEVER, true, true), false)
    assert.equal(shouldShowMap(MAP_NEVER, false, true), false)
  })

  test('no position means no map, whatever the setting', () => {
    // The card passes whether there are real coordinates, not merely whether
    // a tracker exists: an empty map centred on nothing is worse than none.
    assert.equal(shouldShowMap(MAP_ALWAYS, true, false), false)
    assert.equal(shouldShowMap(MAP_NAVIGATING, true, false), false)
  })
})
