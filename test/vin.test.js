import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { decodeVin, generationFor, driveHandFor, identityFromModelName } from '../src/lib/vin.js'

// Character 4 is the vehicle line, character 10 the model year.
// 7SAYGDEF9T is a 2026 (T) Model Y (Y) from Austin.
const MODEL_Y_2026 = '7SAYGDEF9TA123456'
const MODEL_Y_2022 = '7SAYGDEF9NA123456'
const MODEL_3_2024 = '5YJ3E1EA9RF123456'
const MODEL_3_2021 = '5YJ3E1EA9MF123456'

describe('decodeVin', () => {
  test('reads model, year and generation from a Juniper Model Y', () => {
    const id = decodeVin(MODEL_Y_2026)
    assert.equal(id.model, 'my')
    assert.equal(id.name, 'Model Y')
    assert.equal(id.year, 2026)
    assert.equal(id.generation, 'juniper')
  })

  test('an older Model Y resolves to the previous body', () => {
    assert.equal(decodeVin(MODEL_Y_2022).generation, 'legacy')
  })

  test('Model 3 switches to Highland from 2024', () => {
    assert.equal(decodeVin(MODEL_3_2024).generation, 'highland')
    assert.equal(decodeVin(MODEL_3_2021).generation, 'legacy')
  })

  test('is case and whitespace insensitive', () => {
    assert.equal(decodeVin(`  ${MODEL_Y_2026.toLowerCase()} `).model, 'my')
  })

  test('rejects anything that is not a 17 character VIN', () => {
    for (const bad of [null, undefined, '', 'ABC', 123, MODEL_Y_2026.slice(0, 16)]) {
      assert.equal(decodeVin(bad), null, `expected null for ${String(bad)}`)
    }
  })

  test('rejects an unknown vehicle line rather than guessing', () => {
    assert.equal(decodeVin('7SAQGDEF9TA123456'), null)
  })

  test('keeps the model but drops the year when the year code is unknown', () => {
    const id = decodeVin('7SAYGDEF91A123456')
    assert.equal(id.model, 'my')
    assert.equal(id.year, null)
    assert.equal(id.generation, 'juniper', 'unknown year assumes the current body')
  })
})

describe('generationFor', () => {
  test('a line with only one body has no generation', () => {
    assert.equal(generationFor('ct', 2026), null)
  })

  test('the boundary year belongs to the newer body', () => {
    assert.equal(generationFor('my', 2025), 'juniper')
    assert.equal(generationFor('my', 2024), 'legacy')
  })
})

describe('driveHandFor', () => {
  test('picks right-hand drive for those markets', () => {
    assert.equal(driveHandFor('GB'), 'rhd')
    assert.equal(driveHandFor('au'), 'rhd')
  })

  test('defaults to left-hand drive elsewhere and when unset', () => {
    assert.equal(driveHandFor('US'), 'lhd')
    assert.equal(driveHandFor(null), 'lhd')
  })
})

describe('identityFromModelName', () => {
  test('falls back to the device model when no VIN is available', () => {
    const id = identityFromModelName('Model Y')
    assert.equal(id.model, 'my')
    assert.equal(id.vin, null)
    assert.equal(id.year, null)
  })

  test('returns null for a name it does not recognise', () => {
    assert.equal(identityFromModelName('Model Q'), null)
    assert.equal(identityFromModelName(null), null)
  })
})
