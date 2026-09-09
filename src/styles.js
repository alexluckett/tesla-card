import { css } from 'lit'

/**
 * Every colour comes from a Home Assistant token, so the card follows
 * whatever theme is running. The only card-specific decisions are which
 * token carries which meaning.
 */
export const styles = css`
  :host {
    --tc-text: var(--primary-text-color, #212121);
    --tc-dim: var(--secondary-text-color, #727272);
    --tc-line: var(--divider-color, rgba(0, 0, 0, 0.12));
    --tc-accent: var(--primary-color, #03a9f4);
    --tc-warn: var(--warning-color, #ffa726);
    --tc-ok: var(--success-color, #43a047);
    --tc-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tc-font: var(--ha-font-family-body, Roboto, Noto, sans-serif);
  }

  ha-card {
    padding: 16px;
    font-family: var(--tc-font);
    display: block;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .name {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--tc-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The glyph carries lock state, the word carries motion state. They are
     separate facts, so they take separate colours. */
  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: var(--ha-font-size-s, 13px);
    white-space: nowrap;
  }
  .status svg {
    width: 15px;
    height: 15px;
    fill: var(--tc-dim);
    flex: none;
  }
  .status.unlocked svg {
    fill: var(--tc-warn);
  }
  .status span {
    color: var(--tc-dim);
  }
  .status.charging span {
    color: var(--tc-ok);
  }
  .status.driving span {
    color: var(--tc-accent);
  }
  .status.asleep {
    opacity: 0.8;
  }

  /* Cropped to the render's real content bounds. The compositor frames every
     vehicle identically per view, so one constant per view holds throughout. */
  .hero {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin: 10px 0 14px;
  }
  .hero img {
    position: absolute;
    max-width: none;
    display: block;
  }
  .hero.asleep img {
    opacity: 0.65;
    filter: saturate(0.65);
  }
  .hero.blank {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 2.273;
    background: var(--tc-line);
    border-radius: 10px;
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 13px);
    text-align: center;
    padding: 0 24px;
  }

  .strip {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0 0 10px;
    font-variant-numeric: tabular-nums;
  }
  .value {
    font-size: var(--ha-font-size-2xl, 28px);
    font-weight: var(--ha-font-weight-light, 300);
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--tc-text);
  }
  .unit {
    font-size: var(--ha-font-size-m, 14px);
    color: var(--tc-dim);
    margin-left: 1px;
  }
  .range {
    font-size: var(--ha-font-size-l, 15px);
    color: var(--tc-text);
    opacity: 0.72;
    margin-left: 4px;
  }
  .age {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--tc-dim);
    opacity: 0.75;
    margin-left: auto;
    white-space: nowrap;
  }

  .gauge {
    height: 7px;
    border-radius: 3.5px;
    background: var(--tc-line);
    position: relative;
    overflow: visible;
  }
  .fill {
    height: 100%;
    border-radius: 3.5px;
    background: var(--tc-accent);
    position: relative;
    overflow: hidden;
  }
  .fill.charging {
    background: var(--tc-ok);
  }
  .fill.asleep {
    background: var(--tc-dim);
    opacity: 0.55;
  }
  .fill.low {
    background: var(--tc-warn);
  }
  .fill.charging::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
    animation: sheen 2.6s linear infinite;
  }
  @keyframes sheen {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(240%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fill.charging::after {
      animation: none;
    }
  }

  /* One mark on the gauge, meaning one thing: the charge limit. */
  .limit {
    position: absolute;
    top: -4px;
    bottom: -4px;
    width: 2px;
    border-radius: 1px;
    background: var(--tc-dim);
    box-shadow: 0 0 0 2px var(--tc-surface);
  }

  /* Where the car is, or where it is going. Absent when there is nothing true
     to say. */
  .place {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-top: 11px;
    font-size: var(--ha-font-size-s, 13px);
    color: var(--tc-text);
    opacity: 0.85;
    white-space: nowrap;
  }
  .place .lead {
    font-weight: var(--ha-font-weight-medium, 500);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .place .zone {
    font-weight: var(--ha-font-weight-normal, 400);
    color: var(--tc-dim);
  }
  .place .lead svg {
    width: 13px;
    height: 13px;
    fill: currentColor;
    opacity: 0.9;
    flex: none;
  }
  .place .detail {
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 12.5px);
  }

  ha-map {
    display: block;
    margin-top: 12px;
    border-radius: 10px;
    overflow: hidden;
    height: 170px;
  }

  .controls {
    display: flex;
    gap: 6px;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .controls button {
    flex: 1 1 0;
    min-width: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 4px;
    font: inherit;
    font-size: var(--ha-font-size-s, 11.5px);
    color: var(--tc-text);
    background: var(--tc-line);
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
  .controls button:hover:not(:disabled) {
    background: var(--tc-dim);
    color: var(--tc-surface);
  }
  .controls button:focus-visible {
    outline: 2px solid var(--tc-accent);
    outline-offset: 2px;
  }
  .controls button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .controls svg {
    width: 19px;
    height: 19px;
    fill: currentColor;
  }

  .notice {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--tc-line);
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 12.5px);
    line-height: 1.5;
  }
  .notice code {
    font-family: var(--ha-font-family-code, monospace);
    color: var(--tc-text);
  }
`
