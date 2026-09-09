import { TeslaFleetCard } from './card.js'

const ELEMENT = 'tesla-fleet-card'

// Guard against a double registration, which happens when a dashboard loads
// the resource twice or a browser tab is restored mid-update.
if (!customElements.get(ELEMENT)) {
  customElements.define(ELEMENT, TeslaFleetCard)
}

window.customCards = window.customCards || []
if (!window.customCards.some((card) => card.type === ELEMENT)) {
  window.customCards.push({
    type: ELEMENT,
    name: 'Tesla Card',
    description: 'Battery, range and status for a vehicle on the Tesla Fleet integration.',
    preview: true,
    documentationURL: 'https://github.com/alexluckett/tesla-card'
  })
}

export { TeslaFleetCard }
