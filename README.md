# Tesla Card

A Home Assistant dashboard card for vehicles on the [Tesla Fleet][fleet] integration. Point it
at your car and it works out the rest: model, model year, body generation and every entity it
needs.

![The card, parked and navigating](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/preview.png)

## Install

### HACS

1. In Home Assistant, open **HACS**.
2. Search for **Tesla Card** and open it.
3. Choose **Download**.
4. Reload your browser.

If the card is not listed yet, add this repository manually: **HACS → ⋮ → Custom repositories**,
URL `https://github.com/alexluckett/tesla-card`, type **Dashboard**.

The download contains a built file. There is nothing to compile.

### Manually

Download `tesla-card.js` from the [latest release][releases] into `config/www/`, then add it
under **Settings → Dashboards → ⋮ → Resources**:

| Field | Value |
| --- | --- |
| URL | `/local/tesla-card.js` |
| Type | JavaScript module |

## Use it

Add **Tesla Card** from the card picker and choose your vehicle. That is the whole setup.

Two things are worth setting, because the integration does not report them: your **paint** and
your **wheels**. Everything else is read from the car.

```yaml
type: custom:tesla-fleet-card
device_id: 4f2a9c1e8b7d
paint: stealth_grey
wheels: crossflow_19
```

## What it shows

The card has four faces, ordered by how often you will actually see them. The Fleet integration
polls every ten minutes, so **asleep is the common state** and driving is the rare one.

- **Asleep** — the last known reading, dimmed, with its age stated plainly.
- **Parked** — charge, range, lock state, and the zone if Home Assistant has one.
- **Charging** — the gauge fills in green and shows energy flowing.
- **Driving** — speed leads instead of charge.

The mark on the charge gauge is your **charge limit**, read from the car.

Freshness is the newest reading across every entity on the vehicle, not one sensor's
`last_updated`. A battery sitting at 71% does not update its timestamp for hours even while
polling is perfectly healthy, so a single sensor would report staleness that is not real.

### Where it is

The integration reports latitude and longitude and nothing else — there is no address anywhere
in it. Naming a place would mean sending your car's exact position to a geocoding service, so
the card does not do that.

Parked, it names the zone if you have one and stops there. Set a route and a map appears, with
the destination, distance and arrival time read from the car. The solid trail is where the car
has actually been, rebuilt from Home Assistant's history; the hatched line is the direct
bearing to the destination.

Tesla does not publish the road route, so nothing on the map pretends to be one.

To see the destination **by name**, enable one entity that the integration ships switched off:

**Settings → Devices → your car → +n entities → Destination → Enable**

Without it you still get `Arriving in 12 min · 23 miles`. The card tells you when it is missing.

### Controls

Off by default. Switched on, the card renders only the actions your integration actually
exposes, so a read-only setup never shows a dead button. Controlling a Tesla needs command
signing set up in the integration; if you have not done that, leave this off.

Tapping the card itself does nothing. Only buttons act.

## Options

| Option | Default | What it does |
| --- | --- | --- |
| `device_id` | — | The vehicle. Required. |
| `paint` | first for your body | Paint colour. Not reported by the integration. |
| `wheels` | first for your body | Wheels. Not reported by the integration. |
| `map` | `true` | Show a map while a route is set. |
| `trail` | `true` | Draw where the car has been. |
| `controls` | `false` | Show action buttons. |
| `performance` | `false` | Needed before the larger wheels will render. |
| `view` | `FRONT34` | `FRONT34`, `STUD_3QTR`, `SIDE`, `STUD_SIDE`, `REAR34`, `STUD_REAR`. |
| `drive_hand` | from your country | `auto`, `lhd` or `rhd`. |
| `name` | the device name | Override the title. |
| `image` | — | Use your own picture instead of the Tesla render. |
| `options_override` | — | Raw configurator option string. |

## Vehicles

Artwork comes from Tesla's own configurator, so it is the official render of your car in your
colour. The card works out which one from your VIN: character 4 is the model, character 10 the
model year, and the year decides the body.

| Vehicle | Artwork | Confirmed |
| --- | --- | --- |
| Model Y, 2025 onwards (Juniper) | 8 paints, 4 wheels | every combination |
| Model Y, 2020 to 2024 | 5 paints, 2 wheels | every combination |
| Model 3 | 5 paints, 1 wheel | the default only |
| Model S, Model X, Cybertruck | not mapped | — |

Model Y is fully mapped and every listed combination has been checked against the endpoint.
Model 3 has one confirmed combination; its other paint codes are long-standing Tesla codes and
are probably right, but they are unproven. Model S, Model X and Cybertruck use option-code
shapes I have not established.

For anything not mapped, the card shows a plain panel and you can point `image` at your own
picture, or pass `options_override` if you know your car's codes. If you have a working
configurator URL for a vehicle that is missing, that is the most useful thing you can
contribute — it maps a whole model in one go.

### Privacy

The card requests the vehicle render from `static-assets.tesla.com` in your browser. That URL
carries model and option codes only — never your VIN, your location or anything from your
account. No other external request is made. The map uses whatever tiles Home Assistant is
already configured with.

## Building it yourself

You do not need to; releases ship built. If you want to:

```sh
npm install
npm test
npm run build
```

`npm run verify` runs lint, format, tests and the build together.

## Licence

MIT

[fleet]: https://www.home-assistant.io/integrations/tesla_fleet/
[releases]: https://github.com/alexluckett/tesla-card/releases/latest
