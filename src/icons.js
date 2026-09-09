import { svg } from 'lit'

/**
 * Inline Material Design Icons paths. Drawn inline rather than through
 * `ha-icon` so they inherit the card's own colours directly.
 */
export const ICONS = {
  lock: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1M12 3a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg>`,

  lockOpen: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6A5 5 0 0 0 7 6h1.9A3.1 3.1 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>`,

  pin: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>`,

  bolt: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15H6l7-14v8h5l-7 14v-8Z"/></svg>`,

  climate: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a1 1 0 0 1 1 1v7.27a3 3 0 1 1-2 0V3a1 1 0 0 1 1-1m0 3.5a2.5 2.5 0 0 0-2.5 2.5v4.6a4.5 4.5 0 1 0 5 0V8A2.5 2.5 0 0 0 12 5.5Z"/></svg>`,

  sentry: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"/></svg>`,

  wake: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.56 5.44 15.11 6.89A6 6 0 1 1 8.89 6.9L7.44 5.44a8 8 0 1 0 9.12 0M13 3h-2v10h2Z"/></svg>`
}
