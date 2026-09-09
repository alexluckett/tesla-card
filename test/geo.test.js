import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { coordsOf, bearingPath } from '../src/lib/geo.js'

const CAR = [51.5074, -0.1278]
const DEST = [51.4545, -2.5879]

const hassWith = (attributes) => ({ states: { 'device_tracker.y': { attributes } } })

describe('coordsOf', () => {
  test('reads a tracker position', () => {
    const hass = hassWith({ latitude: 51.5074, longitude: -0.1278 })
    assert.deepEqual(coordsOf(hass, 'device_tracker.y'), CAR)
  })

  test('is null when the tracker has no position yet', () => {
    assert.equal(coordsOf(hassWith({}), 'device_tracker.y'), null)
    assert.equal(coordsOf(hassWith({ latitude: 51.5 }), 'device_tracker.y'), null)
  })

  test('rejects values that are not real numbers', () => {
    assert.equal(
      coordsOf(hassWith({ latitude: '51.5', longitude: '-0.1' }), 'device_tracker.y'),
      null
    )
    assert.equal(coordsOf(hassWith({ latitude: NaN, longitude: 0 }), 'device_tracker.y'), null)
  })

  test('survives a missing entity or hass', () => {
    assert.equal(coordsOf(hassWith({}), undefined), null)
    assert.equal(coordsOf(null, 'device_tracker.y'), null)
  })
})

describe('bearingPath', () => {
  test('draws a two point line from the car to the destination', () => {
    const path = bearingPath(CAR, DEST, '#888')
    assert.equal(path.points.length, 2)
    assert.deepEqual(path.points[0].point, CAR)
    assert.deepEqual(path.points[1].point, DEST)
    assert.equal(path.color, '#888')
  })

  test('needs both ends', () => {
    assert.equal(bearingPath(CAR, null, '#888'), null)
    assert.equal(bearingPath(null, DEST, '#888'), null)
  })

  test('draws nothing once the car has arrived', () => {
    // Two identical points would render as a dot on top of the marker.
    assert.equal(bearingPath(CAR, [...CAR], '#888'), null)
  })
})
