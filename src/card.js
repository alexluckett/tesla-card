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

const LOW_CHARGE = 20
/** How much history the trail draws behind the car. */
const TRAIL_HOURS = 2

export class TeslaFleetCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _imageFailed: { state: true },
    _trail: { state: true }
  }

  static styles = styles

  constructor() {
    super()
    this._imageFailed = false
    this._trail = null
    this._unsubscribeHistory = null
    this._trailFor = null
  }

  setConfig(config) {
    if (config.device_id !== undefined && typeof config.device_id !== 'string') {
      throw new Error('device_id must be the id of a Tesla Fleet vehicle')
    }
    this._config = {
      view: 'FRONT34',
      controls: false,
      map: true,
      trail: true,
      ...config
    }
    if (!VIEWS.includes(this._config.view)) this._config.view = 'FRONT34'
    this._imageFailed = false
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._stopHistory()
  }

  /** Masonry sizing. One unit is 50px. */
  getCardSize() {
    return this._showMap() ? 8 : 5
  }

  /** Sections sizing. A row is 56px with an 8px gap. */
  getGridOptions() {
    const rows = this._showMap() ? 8 : 5
    return { rows, columns: 12, min_columns: 6, min_rows: 4 }
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
                { name: 'map', selector: { boolean: {} } },
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
    const showMap = this._showMap() && Boolean(route) && Boolean(entities.location)

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
    const src = this._imageSource(identity, vehicle)
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
        @error=${() => {
          this._imageFailed = true
        }}
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

  _hand() {
    const choice = this._config.drive_hand
    if (choice === 'lhd' || choice === 'rhd') return choice
    return driveHandFor(this.hass?.config?.country)
  }

  /** Driving leads with speed; everything else leads with charge. */
  _readout(vehicle) {
    const driving = vehicle.status === DRIVING && vehicle.speed !== null
    const primary = driving ? vehicle.speed : vehicle.battery
    const unit = driving ? (vehicle.speedUnit ?? 'mph') : '%'
    const range =
      vehicle.range !== null
        ? `${Math.round(vehicle.range)} ${vehicle.rangeUnit ?? 'mi'} remaining`
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
      const eta = this._arrivalIn(route.arrival)
      const where = route.destination ?? 'Destination'
      const lead = eta ? `${where} in ${eta}` : where
      const detail = [
        route.distance !== null
          ? `${Math.round(route.distance)} ${route.distanceUnit ?? 'mi'}`
          : null,
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
    if (this._trail?.length > 1) {
      paths.push({ points: this._trail, color: 'var(--tc-accent)', gradualOpacity: 0.8 })
    }
    // Tesla does not publish the road route, so the line to the destination is
    // drawn hatched: it is a bearing, not a route.
    void route
    return html`<ha-map
      .hass=${this.hass}
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
    if (route && !route.destinationAvailable) {
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
              const at = entry.lu ?? entry.last_updated
              return { point: [lat, lon], timestamp: new Date((at ?? 0) * 1000) }
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

  _showMap() {
    return this._config?.map !== false
  }

  _arrivalIn(iso) {
    if (!iso) return null
    const at = new Date(iso)
    if (Number.isNaN(at.getTime())) return null
    const minutes = Math.round((at.getTime() - Date.now()) / 60000)
    if (minutes < 1) return null
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const rest = minutes % 60
    return rest ? `${hours} hr ${rest} min` : `${hours} hr`
  }

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
  map: 'Show a map while navigating',
  trail: 'Draw where it has been',
  controls: 'Show controls',
  performance: 'Performance model',
  drive_hand: 'Steering wheel',
  name: 'Name',
  image: 'Image URL',
  options_override: 'Configurator options'
}

const HELPERS = {
  device_id: 'The card reads the model, year and body from this vehicle.',
  paint: 'Not reported by the integration, so pick your colour here.',
  wheels: 'Not reported by the integration, so pick your wheels here.',
  map: 'The map appears only when a route is set. A parked car shows its zone instead.',
  performance: 'Needed before the configurator will render the larger wheels.',
  image: 'Show your own picture instead of the configurator render.',
  options_override: 'Raw option string, for a configuration the dropdowns do not cover.'
}
