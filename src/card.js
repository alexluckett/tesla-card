import { LitElement, html, nothing } from 'lit'
import { styles } from './styles.js'
import { decodeVin, identityFromModelName, driveHandFor } from './lib/vin.js'
import {
  imageUrl,
  cropFor,
  isSupported,
  paintsFor,
  wheelsFor,
  defaultPaint,
  defaultWheels,
  VIEWS
} from './lib/compositor.js'
import { resolveEntities, lastUpdated, teslaVehicleDevices, stateOf } from './lib/entities.js'
import { readVehicle, minutesSince, formatAge, ASLEEP, CHARGING, DRIVING } from './lib/state.js'
import { ICONS } from './icons.js'
import { createImageCache, imageErrorAction } from './lib/image-cache.js'
import { display, resolvePreference } from './lib/units.js'
import { coordsOf, bearingPath, currentJourney } from './lib/geo.js'
import { shortenPlace, arrivalIn } from './lib/text.js'
import { mapMode, shouldShowMap, MAP_ALWAYS } from './lib/config.js'

const LOW_CHARGE = 20
/** How much history the trail draws behind the car. */
const TRAIL_HOURS = 2

export class TeslaFleetCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _imageFailed: { state: true },
    _trail: { state: true },
    _cachedSrc: { state: true }
  }

  static styles = styles

  constructor() {
    super()
    this._imageFailed = false
    this._trail = null
    this._unsubscribeHistory = null
    this._trailFor = null
    this._cachedSrc = null
    this._cachedFor = null
    /** Renders already retried from the network, so a bad one cannot loop. */
    this._retried = new Set()
    // Tesla serve the render with max-age=60, so without this the browser
    // re-downloads it every minute a dashboard stays open.
    this._images = createImageCache()
  }

  setConfig(config) {
    if (config.device_id !== undefined && typeof config.device_id !== 'string') {
      throw new Error('device_id must be the id of a Tesla Fleet vehicle')
    }
    this._config = {
      view: 'FRONT34',
      controls: false,
      map: 'navigating',
      trail: true,
      ...config
    }
    if (!VIEWS.includes(this._config.view)) this._config.view = 'FRONT34'
    this._imageFailed = false
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._stopHistory()
    this._images.release()
    this._cachedSrc = null
    this._cachedFor = null
  }

  /** Masonry sizing. One unit is 50px. */
  getCardSize() {
    return mapMode(this._config?.map) === MAP_ALWAYS ? 8 : 5
  }

  /**
   * Sections sizing. Rows are deliberately left undefined: the card grows
   * when a route appears and shrinks again afterwards, so a fixed height
   * would either clip the map or leave a gap where it used to be.
   */
  getGridOptions() {
    return { columns: 12, min_columns: 6 }
  }

  static getStubConfig(hass) {
    return { device_id: teslaVehicleDevices(hass)[0] ?? '' }
  }

  /**
   * The built-in form editor. Home Assistant renders and styles this, so the
   * card contributes no editor UI of its own.
   */
  static getConfigForm() {
    return {
      schema: [
        {
          name: 'device_id',
          required: true,
          selector: { device: { filter: { integration: 'tesla_fleet' } } }
        },
        {
          type: 'grid',
          name: '',
          flatten: true,
          schema: [
            { name: 'paint', selector: { select: { mode: 'dropdown', options: PAINT_OPTIONS } } },
            { name: 'wheels', selector: { select: { mode: 'dropdown', options: WHEEL_OPTIONS } } }
          ]
        },
        {
          type: 'expandable',
          name: 'advanced',
          title: 'More options',
          flatten: true,
          schema: [
            {
              type: 'grid',
              name: '',
              flatten: true,
              schema: [
                { name: 'trail', selector: { boolean: {} } },
                { name: 'controls', selector: { boolean: {} } },
                { name: 'performance', selector: { boolean: {} } }
              ]
            },
            {
              name: 'view',
              selector: {
                select: { mode: 'dropdown', options: VIEWS.map((v) => ({ value: v, label: v })) }
              }
            },
            {
              name: 'map',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'navigating', label: 'Only while navigating' },
                    { value: 'always', label: 'Always' },
                    { value: 'never', label: 'Never' }
                  ]
                }
              }
            },
            {
              name: 'units',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: 'Follow Home Assistant' },
                    { value: 'imperial', label: 'Miles' },
                    { value: 'metric', label: 'Kilometres' }
                  ]
                }
              }
            },
            {
              name: 'drive_hand',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: 'From your country setting' },
                    { value: 'lhd', label: 'Left-hand drive' },
                    { value: 'rhd', label: 'Right-hand drive' }
                  ]
                }
              }
            },
            { name: 'name', selector: { text: {} } },
            { name: 'image', selector: { text: {} } },
            { name: 'options_override', selector: { text: {} } }
          ]
        }
      ],
      computeLabel: (schema) => LABELS[schema.name],
      computeHelper: (schema) => HELPERS[schema.name]
    }
  }

  // ---------------------------------------------------------------- rendering

  render() {
    if (!this._config || !this.hass) return nothing

    const deviceId = this._config.device_id
    const device = deviceId ? this.hass.devices?.[deviceId] : null

    if (!device) {
      return this._shell(
        'Tesla',
        nothing,
        html`<div class="notice">
          Choose a vehicle to show. The card reads everything else from the Tesla Fleet integration.
        </div>`
      )
    }

    const entities = resolveEntities(this.hass, deviceId)
    const vehicle = readVehicle(this.hass, entities)
    const identity = decodeVin(device.serial_number) ?? identityFromModelName(device.model) ?? null
    const name =
      this._config.name || device.name_by_user || device.name || identity?.name || 'Tesla'

    const age = formatAge(minutesSince(lastUpdated(this.hass, entities)))
    const route = vehicle.route
    const showMap = shouldShowMap(
      mapMode(this._config.map),
      Boolean(route),
      coordsOf(this.hass, entities.location) !== null
    )

    this._syncHistory(showMap && this._config.trail ? entities.location : null)

    return html`
      <ha-card>
        <div class="head">
          <div class="name">${name}</div>
          ${this._status(vehicle)}
        </div>
        ${this._hero(identity, vehicle)}
        <div class="strip">
          ${this._readout(vehicle)} ${age ? html`<span class="age">${age}</span>` : nothing}
        </div>
        ${this._gauge(vehicle)} ${this._place(vehicle, route)}
        ${showMap ? this._map(entities, route) : nothing}
        ${this._config.controls ? this._controls(entities) : nothing}
        ${this._notices(identity, route)}
      </ha-card>
    `
  }

  _shell(name, hero, body) {
    return html`<ha-card>
      <div class="head"><div class="name">${name}</div></div>
      ${hero}${body}
    </ha-card>`
  }

  _status(vehicle) {
    const words = {
      [ASLEEP]: 'Asleep',
      [CHARGING]: 'Charging',
      [DRIVING]: 'Driving',
      parked: 'Parked'
    }
    // An unlocked car is worth flagging when it is sitting still, not while
    // someone is driving it.
    const flagUnlocked = vehicle.locked === false && vehicle.status !== DRIVING
    const classes = ['status', vehicle.status, flagUnlocked ? 'unlocked' : ''].join(' ')
    return html`<span class=${classes}>
      ${vehicle.locked === false ? ICONS.lockOpen : ICONS.lock}
      <span>${words[vehicle.status] ?? 'Parked'}</span>
    </span>`
  }

  _hero(identity, vehicle) {
    const remote = this._imageSource(identity, vehicle)
    this._syncImage(remote)
    // Show Tesla's URL until the stored copy is ready, so the first paint is
    // never delayed by the cache.
    const src = this._cachedFor === remote && this._cachedSrc ? this._cachedSrc : remote
    if (!src) {
      return html`<div class="hero blank">
        ${
          identity
            ? `No configurator artwork for the ${identity.name} yet.`
            : 'Waiting for the vehicle to report.'
        }
      </div>`
    }
    const crop = cropFor(this._config.view)
    const style = `aspect-ratio:${crop.aspect}`
    const imgStyle = `width:${crop.width * 100}%;left:${crop.left * 100}%;top:${crop.top * 100}%`
    return html`<div class="hero ${vehicle.status === ASLEEP ? 'asleep' : ''}" style=${style}>
      <img
        src=${src}
        alt=${identity?.name ?? 'Tesla'}
        style=${imgStyle}
        loading="lazy"
        @error=${() => this._onImageError(src, remote)}
      />
    </div>`
  }

  _imageSource(identity, vehicle) {
    if (this._config.image) return this._config.image
    if (this._imageFailed || !identity) return null
    if (!isSupported(identity.model, identity.generation)) return null
    void vehicle
    return imageUrl({
      model: identity.model,
      generation: identity.generation,
      paint: this._config.paint ?? defaultPaint(identity.model, identity.generation),
      wheels: this._config.wheels ?? defaultWheels(identity.model, identity.generation),
      performance: this._config.performance === true,
      hand: this._hand(),
      view: this._config.view,
      optionsOverride: this._config.options_override ?? null
    })
  }

  /**
   * A stored render the browser cannot decode must not blank the card for
   * good. Throw that copy away and go back to the network once; only give up
   * if the fresh one fails too.
   *
   * @param {string} shown The src that failed
   * @param {string | null} remote The canonical Tesla URL for this config
   */
  _onImageError(shown, remote) {
    if (imageErrorAction(shown, remote, this._retried) === 'retry') {
      this._retried.add(remote)
      this._images.evict(remote).then(() => {
        if (this._cachedFor !== remote) return
        this._cachedSrc = null
        this._images.resolve(remote).then((src) => {
          if (this._cachedFor === remote) this._cachedSrc = src
        })
      })
      return
    }
    this._imageFailed = true
  }

  /**
   * Keep one stored render per configuration. The URL already encodes every
   * option, so a change of paint, wheels, angle or vehicle is a new key and
   * the old one is evicted.
   *
   * @param {string | null} remote
   */
  _syncImage(remote) {
    if (this._cachedFor === remote) return
    this._cachedFor = remote
    this._cachedSrc = null
    this._imageFailed = false
    if (!remote || this._config.image) return
    this._images.resolve(remote).then((src) => {
      if (this._cachedFor !== remote) return
      this._cachedSrc = src
      this._images.prune([remote])
    })
  }

  /**
   * A real colour value for a token, for handing to a component that renders
   * in its own shadow root where the variable is not defined.
   *
   * @param {string} token
   * @param {string} fallback
   */
  _cssColor(token, fallback) {
    try {
      return getComputedStyle(this).getPropertyValue(token).trim() || fallback
    } catch {
      return fallback
    }
  }

  /** Miles or kilometres, settled once per render. */
  _units() {
    return resolvePreference(this._config.units)
  }

  _hand() {
    const choice = this._config.drive_hand
    if (choice === 'lhd' || choice === 'rhd') return choice
    return driveHandFor(this.hass?.config?.country)
  }

  /** Driving leads with speed; everything else leads with charge. */
  _readout(vehicle) {
    const preference = this._units()
    const driving = vehicle.status === DRIVING && vehicle.speed !== null
    const speed = display(vehicle.speed, vehicle.speedUnit, preference, 'speed')
    const distance = display(vehicle.range, vehicle.rangeUnit, preference)

    const primary = driving ? speed.value : vehicle.battery
    const unit = driving ? (speed.unit ?? 'mph') : '%'
    const range =
      distance.value !== null
        ? `${Math.round(distance.value)} ${distance.unit ?? 'mi'} remaining`
        : null

    return html`
      <span class="value"
        >${primary === null ? '—' : Math.round(primary)}<span class="unit">${unit}</span></span
      >
      ${range ? html`<span class="range">${range}</span>` : nothing}
    `
  }

  _gauge(vehicle) {
    const pct = vehicle.battery ?? 0
    const classes = [
      'fill',
      vehicle.status === CHARGING ? 'charging' : '',
      vehicle.status === ASLEEP ? 'asleep' : '',
      vehicle.status !== CHARGING && pct <= LOW_CHARGE ? 'low' : ''
    ].join(' ')
    const limit = vehicle.chargeLimit
    return html`<div class="gauge">
      <div class=${classes} style=${`width:${clamp(pct)}%`}></div>
      ${
        limit !== null && limit > 0 && limit < 100
          ? html`<div
              class="limit"
              style=${`left:${clamp(limit)}%`}
              title=${`Charge limit ${Math.round(limit)}%`}
            ></div>`
          : nothing
      }
    </div>`
  }

  /**
   * The navigation readout when a route is set, otherwise the zone name if
   * Home Assistant has one. Nothing at all when neither is true.
   */
  _place(vehicle, route) {
    if (route) {
      const eta = arrivalIn(route.arrival)
      const where = shortenPlace(route.destination)
      // The name is the part that may not fit, so it is the part that gets
      // truncated. The time must never be the thing that falls off the end.
      const lead = where
        ? html`<span class="where" title=${route.destination}>${where}</span>
            ${eta ? html`<span class="eta">in ${eta}</span>` : nothing}`
        : html`<span class="where">${eta ? `Arriving in ${eta}` : 'On a route'}</span>`
      const togo = display(route.distance, route.distanceUnit, this._units())
      const detail = [
        togo.value !== null ? `${Math.round(togo.value)} ${togo.unit ?? 'mi'}` : null,
        route.arrival ? `arriving ${this._clock(route.arrival)}` : null
      ]
        .filter(Boolean)
        .join(', ')
      return html`<div class="place">
        <span class="lead">${lead}</span>
        ${detail ? html`<span class="detail">${detail}</span>` : nothing}
      </div>`
    }
    if (!vehicle.zone) return nothing
    return html`<div class="place">
      <span class="lead zone">${ICONS.pin}${vehicle.zone}</span>
    </div>`
  }

  _map(entities, route) {
    if (!customElements.get('ha-map')) return nothing
    const points = [entities.location, entities.route].filter(Boolean)
    const paths = []
    // The map lives in its own shadow root, so a CSS variable would never
    // resolve there. Read the real colour off this card instead.
    const journey = currentJourney(this._trail ?? [])
    if (journey.length > 1) {
      paths.push({
        points: journey,
        color: this._cssColor('--tc-accent', '#03a9f4'),
        gradualOpacity: 0.8
      })
    }
    // Only while a route is actually set: the route tracker can still hold
    // the last destination after arriving, and a line to somewhere the car is
    // no longer going would be a lie.
    const bearing = route
      ? bearingPath(
          coordsOf(this.hass, entities.location),
          coordsOf(this.hass, entities.route),
          this._cssColor('--tc-dim', '#9b9b9b')
        )
      : null
    if (bearing) paths.push(bearing)
    // No hass property: ha-map takes states, config and connection from Lit
    // contexts the dashboard provides, and those requests cross this card's
    // shadow boundary on their own. Home Assistant's own map card passes the
    // same set and no hass either.
    return html`<ha-map
      .entities=${points}
      .paths=${paths}
      .themeMode=${'auto'}
      .autoFit=${true}
      .zoom=${13}
      .clusterMarkers=${false}
    ></ha-map>`
  }

  _controls(entities) {
    const actions = [
      { id: 'lock', label: 'Lock', icon: ICONS.lock, entity: entities.locked, domain: 'lock' },
      {
        id: 'charge',
        label: 'Charge',
        icon: ICONS.bolt,
        entity: entities.chargingState,
        domain: 'switch'
      },
      {
        id: 'climate',
        label: 'Climate',
        icon: ICONS.climate,
        entity: entities.climate,
        domain: 'climate'
      },
      { id: 'wake', label: 'Wake', icon: ICONS.wake, entity: entities.wake, domain: 'button' }
    ].filter((action) => Boolean(action.entity))

    if (!actions.length) return nothing
    return html`<div class="controls">
      ${actions.map(
        (action) =>
          html`<button
            type="button"
            @click=${(event) => this._runAction(event, action)}
            title=${action.label}
          >
            ${action.icon}${action.label}
          </button>`
      )}
    </div>`
  }

  async _runAction(event, action) {
    // Only a button acts. Tapping the card itself does nothing.
    event.stopPropagation()
    const state = stateOf(this.hass, action.entity)
    try {
      if (action.domain === 'lock') {
        const on = state?.state === 'locked'
        await this.hass.callService('lock', on ? 'unlock' : 'lock', { entity_id: action.entity })
      } else if (action.domain === 'button') {
        await this.hass.callService('button', 'press', { entity_id: action.entity })
      } else {
        await this.hass.callService('homeassistant', 'toggle', { entity_id: action.entity })
      }
    } catch (error) {
      // Surface the failure rather than letting the button look like it worked.
      this.dispatchEvent(
        new CustomEvent('hass-notification', {
          detail: { message: `${action.label} failed: ${error?.message ?? 'unknown error'}` },
          bubbles: true,
          composed: true
        })
      )
    }
  }

  _notices(identity, route) {
    const notices = []
    if (identity && !isSupported(identity.model, identity.generation) && !this._config.image) {
      notices.push(
        html`Artwork for the ${identity.name} is not mapped yet. Set an <code>image</code> URL to
          show your own.`
      )
    }
    if (route && route.destinationEntityMissing) {
      notices.push(
        html`Enable the <code>Destination</code> entity on this device to see where the car is
          headed by name.`
      )
    }
    if (!notices.length) return nothing
    return html`${notices.map((notice) => html`<div class="notice">${notice}</div>`)}`
  }

  // ------------------------------------------------------------------ history

  /**
   * Subscribe to the vehicle's recent positions so the map can draw where it
   * has actually been. Home Assistant's own map card sources its trail the
   * same way.
   */
  _syncHistory(entityId) {
    if (this._trailFor === entityId) return
    this._trailFor = entityId
    this._stopHistory()
    this._trail = null
    if (!entityId || !this.hass?.connection) return

    const start = new Date(Date.now() - TRAIL_HOURS * 3600 * 1000).toISOString()
    this.hass.connection
      .subscribeMessage(
        (message) => {
          const states = message?.states?.[entityId]
          if (!states) return
          const points = states
            .map((entry) => {
              const attributes = entry.a ?? entry.attributes ?? {}
              const lat = attributes.latitude
              const lon = attributes.longitude
              if (typeof lat !== 'number' || typeof lon !== 'number') return null
              // The stream sends unix seconds; anything else is unusable.
              const at = entry.lu ?? entry.last_updated
              if (typeof at !== 'number') return null
              return { point: [lat, lon], timestamp: new Date(at * 1000) }
            })
            .filter(Boolean)
          if (points.length) this._trail = points
        },
        {
          type: 'history/stream',
          entity_ids: [entityId],
          start_time: start,
          minimal_response: true,
          no_attributes: false
        }
      )
      .then((unsubscribe) => {
        this._unsubscribeHistory = unsubscribe
      })
      .catch(() => {
        // No recorder, or history is not loaded. The map still shows position.
        this._trail = null
      })
  }

  _stopHistory() {
    if (this._unsubscribeHistory) {
      try {
        this._unsubscribeHistory()
      } catch {
        // Already gone.
      }
      this._unsubscribeHistory = null
    }
  }

  // ------------------------------------------------------------------ helpers

  _clock(iso) {
    const at = new Date(iso)
    if (Number.isNaN(at.getTime())) return ''
    try {
      return at.toLocaleTimeString(this.hass?.locale?.language ?? undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return at.toISOString().slice(11, 16)
    }
  }
}

function clamp(value) {
  return Math.min(100, Math.max(0, Number(value) || 0))
}

const PAINT_OPTIONS = uniqueOptions(paintsFor('my', 'juniper').concat(paintsFor('my', 'legacy')))
const WHEEL_OPTIONS = uniqueOptions(
  wheelsFor('my', 'juniper', true).concat(wheelsFor('my', 'legacy', true))
)

function uniqueOptions(list) {
  const seen = new Map()
  for (const entry of list) if (!seen.has(entry.id)) seen.set(entry.id, entry.name)
  return [...seen].map(([value, label]) => ({ value, label }))
}

const LABELS = {
  device_id: 'Vehicle',
  paint: 'Paint',
  wheels: 'Wheels',
  view: 'Angle',
  map: 'Show a map',
  trail: 'Draw where it has been',
  controls: 'Show controls',
  performance: 'Performance model',
  units: 'Distance and speed',
  drive_hand: 'Steering wheel',
  name: 'Name',
  image: 'Image URL',
  options_override: 'Configurator options'
}

const HELPERS = {
  device_id: 'The card reads the model, year and body from this vehicle.',
  paint: 'Not reported by the integration, so pick your colour here.',
  wheels: 'Not reported by the integration, so pick your wheels here.',
  units: 'Home Assistant treats the UK as metric, so set this to miles if you want road units.',
  map: 'Showing it only while navigating keeps the card small the rest of the time.',
  performance: 'Needed before the configurator will render the larger wheels.',
  image: 'Show your own picture instead of the configurator render.',
  options_override: 'Raw option string, for a configuration the dropdowns do not cover.'
}
