import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { shortenPlace, arrivalIn } from '../src/lib/text.js'

describe('shortenPlace', () => {
  test('leaves a short name alone', () => {
    assert.equal(shortenPlace('Home'), 'Home')
    assert.equal(shortenPlace('Tesco Extra, Slough'), 'Tesco Extra, Slough')
  })

  test('reduces a postal address to the part a person recognises', () => {
    assert.equal(
      shortenPlace('42 Kingsway Avenue, Farnborough, Hampshire GU14 7QR'),
      '42 Kingsway Avenue'
    )
  })

  test('keeps a long name that has no comma to cut at', () => {
    const long = 'The Very Long Name Of Somewhere That Should Never Fit'
    assert.equal(shortenPlace(long), long, 'the card ellipsis handles this one')
  })

  test('tidies stray whitespace', () => {
    assert.equal(shortenPlace('  Tesla   Supercharger  '), 'Tesla Supercharger')
  })

  test('is null for nothing usable', () => {
    assert.equal(shortenPlace(null), null)
    assert.equal(shortenPlace('   '), null)
    assert.equal(shortenPlace(42), null)
  })
})

describe('arrivalIn', () => {
  const now = new Date('2026-09-10T08:00:00Z')
  const inMinutes = (n) => new Date(now.getTime() + n * 60000).toISOString()

  test('the everyday case: home in twenty minutes', () => {
    assert.equal(arrivalIn(inMinutes(20), now), '20 min')
  })

  test('work in fifteen minutes', () => {
    assert.equal(arrivalIn(inMinutes(15), now), '15 min')
  })

  test('rounds to the nearest minute rather than truncating', () => {
    assert.equal(arrivalIn(new Date(now.getTime() + 12.6 * 60000).toISOString(), now), '13 min')
  })

  test('says hours for a long drive', () => {
    assert.equal(arrivalIn(inMinutes(60), now), '1 hr')
    assert.equal(arrivalIn(inMinutes(95), now), '1 hr 35 min')
    assert.equal(arrivalIn(inMinutes(240), now), '4 hr')
  })

  test('is null once the arrival is now or past', () => {
    // A countdown that has run out would otherwise sit there saying "in 0 min".
    assert.equal(arrivalIn(inMinutes(0), now), null)
    assert.equal(arrivalIn(inMinutes(-5), now), null)
  })

  test('is null for a sensor that has nothing to say', () => {
    assert.equal(arrivalIn(null, now), null)
    assert.equal(arrivalIn('', now), null)
    assert.equal(arrivalIn('unavailable', now), null)
  })
})
