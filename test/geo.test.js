import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { coordsOf, bearingPath, currentJourney } from '../src/lib/geo.js'

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

describe('currentJourney', () => {
  const base = new Date('2026-09-10T08:00:00Z').getTime()
  const at = (minutes, lat = 51.5, lon = -0.1) => ({
    point: [lat + minutes / 1000, lon],
    timestamp: new Date(base + minutes * 60000)
  })

  test('a single continuous drive is kept whole', () => {
    const drive = [at(0), at(10), at(20), at(30)]
    assert.equal(currentJourney(drive).length, 4)
  })

  test("this morning's trip is not joined onto the one happening now", () => {
    // The recorder window holds both. Drawn as one path they would be linked
    // by a straight line the car never drove.
    const earlier = [at(0), at(10), at(20)]
    const parkedForAnHour = [at(90), at(100), at(110)]
    const journey = currentJourney([...earlier, ...parkedForAnHour])

    assert.equal(journey.length, 3, 'only the current trip is drawn')
    assert.deepEqual(journey[0].timestamp, at(90).timestamp)
  })

  test('a brief stop mid-journey does not split it', () => {
    // The car stays awake and keeps reporting, so the gaps stay small.
    const withStop = [at(0), at(10), at(20), at(35), at(45)]
    assert.equal(currentJourney(withStop).length, 5)
  })

  test('splits on the gap it is given', () => {
    const points = [at(0), at(10), at(40), at(50)]
    assert.equal(currentJourney(points, 25 * 60 * 1000).length, 2)
    assert.equal(currentJourney(points, 45 * 60 * 1000).length, 4)
  })

  test('draws nothing from a single fix', () => {
    assert.deepEqual(currentJourney([at(0)]), [])
    assert.deepEqual(currentJourney([]), [])
    assert.deepEqual(currentJourney(null), [])
  })

  test('orders points that arrive out of sequence', () => {
    const journey = currentJourney([at(20), at(0), at(10)])
    assert.deepEqual(
      journey.map((p) => p.timestamp.getTime()),
      [at(0).timestamp.getTime(), at(10).timestamp.getTime(), at(20).timestamp.getTime()]
    )
  })

  test('discards fixes with no usable time', () => {
    const journey = currentJourney([at(0), { point: [1, 2], timestamp: 'nope' }, at(10)])
    assert.equal(journey.length, 2)
  })
})
