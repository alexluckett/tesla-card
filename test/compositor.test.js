import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  imageUrl,
  wheelsFor,
  paintsFor,
  bodyFor,
  isSupported,
  defaultPaint,
  cropFor
} from '../src/lib/compositor.js'

const optionsOf = (url) => new URL(url).searchParams.get('options')

describe('imageUrl', () => {
  test('builds the verified Juniper Model Y request', () => {
    const url = imageUrl({
      model: 'my',
      generation: 'juniper',
      paint: 'stealth_grey',
      wheels: 'crossflow_19',
      hand: 'rhd'
    })
    const params = new URL(url).searchParams
    assert.equal(params.get('model'), 'my')
    assert.equal(params.get('context'), 'design_studio_2')
    assert.equal(params.get('view'), 'FRONT34')
    assert.equal(optionsOf(url), '$MTY86,$PN01,$WY19P,$IPB12,$DRRH')
  })

  test('asks for a transparent PNG, not the opaque JPEG variants', () => {
    const params = new URL(imageUrl({ model: 'my', generation: 'juniper' })).searchParams
    assert.equal(params.get('bkba_opt'), '1')
  })

  test('omits the drive-hand flag for left-hand drive', () => {
    const url = imageUrl({ model: 'my', generation: 'juniper', hand: 'lhd' })
    assert.ok(!optionsOf(url).includes('$DRRH'))
  })

  test('always emits trim, paint, wheels and interior together', () => {
    // The compositor refuses a partial option set, so every URL needs all four.
    const parts = optionsOf(imageUrl({ model: 'my', generation: 'juniper' })).split(',')
    assert.equal(parts.length, 4)
    assert.ok(parts.some((p) => p.startsWith('$MTY')))
    assert.ok(parts.some((p) => p.startsWith('$IPB')))
  })

  test('Performance swaps trim and interior as well as wheels', () => {
    const url = imageUrl({
      model: 'my',
      generation: 'juniper',
      wheels: 'performance_21',
      performance: true
    })
    assert.equal(optionsOf(url), '$MTY53,$PN01,$WY21A,$IPB14')
  })

  test('a Performance-only wheel on a standard trim falls back instead of 404ing', () => {
    const url = imageUrl({ model: 'my', generation: 'juniper', wheels: 'performance_21' })
    assert.ok(optionsOf(url).includes('$WY19P'))
    assert.ok(!optionsOf(url).includes('$WY21A'))
  })

  test('an unknown paint falls back to the first for that body', () => {
    const url = imageUrl({ model: 'my', generation: 'juniper', paint: 'chartreuse' })
    assert.ok(optionsOf(url).includes('$PN01'))
  })

  test('the older Model Y uses its own code set', () => {
    const url = imageUrl({ model: 'my', generation: 'legacy', paint: 'pearl_white' })
    assert.equal(optionsOf(url), '$MDLY,$MTY01,$PPSW,$WY19B,$INPB0')
  })

  test('a raw override replaces the generated options entirely', () => {
    const url = imageUrl({
      model: 'my',
      generation: 'juniper',
      optionsOverride: '$MTY70,$PB01,$WY21A,$IPB14'
    })
    assert.equal(optionsOf(url), '$MTY70,$PB01,$WY21A,$IPB14')
  })

  test('returns null for a vehicle with no code table yet', () => {
    assert.equal(imageUrl({ model: 'ct' }), null)
  })
})

describe('catalogue', () => {
  test('offers every Juniper paint confirmed against the configurator', () => {
    assert.equal(paintsFor('my', 'juniper').length, 8)
  })

  test('Model 3 resolves to its own verified option set', () => {
    const url = imageUrl({ model: 'm3', paint: 'pearl_white' })
    assert.equal(new URL(url).searchParams.get('options'), '$MDL3,$MT300,$PPSW,$W38B,$IN3PB')
  })

  test('hides Performance-only wheels unless the trim allows them', () => {
    assert.ok(!wheelsFor('my', 'juniper').some((w) => w.id === 'performance_21'))
    assert.ok(wheelsFor('my', 'juniper', true).some((w) => w.id === 'performance_21'))
  })

  test('an unknown generation still resolves to a usable body', () => {
    assert.ok(bodyFor('my', 'nonsense'))
    assert.equal(defaultPaint('my', 'juniper'), 'stealth_grey')
  })

  test('reports support honestly', () => {
    assert.equal(isSupported('my', 'juniper'), true)
    assert.equal(isSupported('ct', null), false)
  })
})

describe('cropFor', () => {
  test('every listed view has a crop and falls back safely', () => {
    assert.ok(cropFor('FRONT34').aspect > 1)
    assert.deepEqual(cropFor('NOT_A_VIEW'), cropFor('FRONT34'))
  })
})
