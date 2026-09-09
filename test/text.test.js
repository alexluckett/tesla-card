import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { shortenPlace } from '../src/lib/text.js'

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
