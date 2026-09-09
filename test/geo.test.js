import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  coordsOf,
  bearingPath,
  bearingLayer,
  bearingArrow,
  arrowPoints,
  driftDashes,
  DASH,
  currentJourney
} from '../src/lib/geo.js'

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

describe('bearingLayer', () => {
  const CAR2 = [51.5074, -0.1278]
  const DEST2 = [51.4545, -2.5879]
  // Just enough of Leaflet to record what it was asked for.
  const fakeLeaflet = () => {
    const calls = []
    return {
      calls,
      polyline: (points, opts) => {
        calls.push({ points, opts })
        return { __layer: true }
      }
    }
  }

  test('draws the bearing dashed, which a path cannot be', () => {
    // HaMapPaths has no dash option, so the only way to make the bearing
    // visually distinct from the trail is a Leaflet layer.
    const L = fakeLeaflet()
    const layer = bearingLayer(L, CAR2, DEST2, '#888')
    assert.ok(layer)
    assert.deepEqual(L.calls[0].points, [CAR2, DEST2])
    assert.equal(L.calls[0].opts.dashArray, DASH.join(' '))
    assert.equal(L.calls[0].opts.color, '#888')
    assert.equal(L.calls[0].opts.interactive, false)
  })

  test('is null without Leaflet, so the caller can fall back to a solid path', () => {
    assert.equal(bearingLayer(null, CAR2, DEST2, '#888'), null)
    assert.equal(bearingLayer({}, CAR2, DEST2, '#888'), null)
  })

  test('needs both ends, and draws nothing once arrived', () => {
    const L = fakeLeaflet()
    assert.equal(bearingLayer(L, CAR2, null, '#888'), null)
    assert.equal(bearingLayer(L, null, DEST2, '#888'), null)
    assert.equal(bearingLayer(L, CAR2, [...CAR2], '#888'), null)
    assert.equal(L.calls.length, 0)
  })
})

describe('arrowPoints', () => {
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

  test('the tip sits along the line, nearer the destination', () => {
    const from = [51.0, 0.0]
    const to = [52.0, 0.0]
    const [, tip] = arrowPoints(from, to)
    assert.ok(dist(tip, to) < dist(tip, from), 'points the way it is going')
    assert.ok(tip[0] > from[0] && tip[0] < to[0], 'and stays on the line')
  })

  test('both barbs trail behind the tip, so it reads as an arrowhead', () => {
    const from = [51.0, 0.0]
    const to = [52.0, 0.0]
    const [b1, tip, b2] = arrowPoints(from, to)
    // Heading north, so both barbs must be south of the tip.
    assert.ok(b1[0] < tip[0])
    assert.ok(b2[0] < tip[0])
    // One either side, not both on the same side.
    assert.ok((b1[1] - tip[1]) * (b2[1] - tip[1]) < 0)
  })

  test('turns round when the journey does', () => {
    const [, tipNorth] = arrowPoints([51, 0], [52, 0])
    const [, tipSouth] = arrowPoints([52, 0], [51, 0])
    assert.ok(tipNorth[0] > 51 && tipNorth[0] < 52)
    assert.ok(tipSouth[0] < 52 && tipSouth[0] > 51)
    assert.ok(tipSouth[0] < tipNorth[0], 'the tip leads in the direction of travel')
  })

  test('does not lean when the journey runs east to west', () => {
    // Longitude degrees are shorter than latitude degrees away from the
    // equator. Without correcting for that the arrowhead skews.
    const [b1, tip, b2] = arrowPoints([55.0, -1.0], [55.0, 1.0])
    assert.ok(Math.abs(b1[0] - tip[0]) > 0, 'the barbs spread across the line')
    assert.ok(
      Math.abs(Math.abs(b1[0] - tip[0]) - Math.abs(b2[0] - tip[0])) < 1e-9,
      'and spread evenly either side'
    )
  })

  test('scales with the length of the journey', () => {
    const near = arrowPoints([51, 0], [51.1, 0])
    const far = arrowPoints([51, 0], [53, 0])
    const spread = (p) => Math.hypot(p[0][0] - p[2][0], p[0][1] - p[2][1])
    assert.ok(spread(far) > spread(near), 'a long trip gets a proportionate arrow')
  })

  test('draws nothing without two distinct ends', () => {
    assert.equal(arrowPoints([51, 0], [51, 0]), null)
    assert.equal(arrowPoints(null, [51, 0]), null)
    assert.equal(arrowPoints([51, 0], null), null)
  })
})

describe('bearingArrow', () => {
  test('builds a Leaflet polyline for the arrowhead', () => {
    const calls = []
    const L = { polyline: (points, opts) => (calls.push({ points, opts }), { __layer: true }) }
    assert.ok(bearingArrow(L, [51, 0], [52, 0], '#888'))
    assert.equal(calls[0].points.length, 3)
    assert.equal(calls[0].opts.color, '#888')
    assert.ok(!calls[0].opts.dashArray, 'the head is solid; only the line is dashed')
  })

  test('is null without Leaflet', () => {
    assert.equal(bearingArrow(null, [51, 0], [52, 0], '#888'), null)
  })
})

describe('driftDashes', () => {
  const fakeEl = () => {
    const runs = []
    return { runs, animate: (frames, opts) => (runs.push({ frames, opts }), { __anim: true }) }
  }

  test('sends the dashes one full cycle, so the loop is seamless', () => {
    // Any other distance and the pattern visibly jumps on each repeat.
    const el = fakeEl()
    assert.ok(driftDashes(el))
    const { frames, opts } = el.runs[0]
    assert.equal(frames[0].strokeDashoffset, 0)
    assert.equal(frames[1].strokeDashoffset, -(DASH[0] + DASH[1]))
    assert.equal(opts.iterations, Infinity)
    assert.equal(opts.easing, 'linear')
  })

  test('travels towards the destination, not away from it', () => {
    const el = fakeEl()
    driftDashes(el)
    assert.ok(el.runs[0].frames[1].strokeDashoffset < 0, 'a negative offset moves along the path')
  })

  test('does nothing when reduced motion is asked for', () => {
    const el = fakeEl()
    assert.equal(driftDashes(el, true), null)
    assert.equal(el.runs.length, 0, 'the arrowhead carries the direction instead')
  })

  test('does nothing without an element that can animate', () => {
    assert.equal(driftDashes(null), null)
    assert.equal(driftDashes({}), null)
  })
})
