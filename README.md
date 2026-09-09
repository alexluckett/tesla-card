# Tesla Card

A Home Assistant dashboard card for vehicles on the [Tesla Fleet][fleet] integration. Point it
at your car and it works out the rest: model, model year, body generation and every entity it
needs.

![The card parked, and driving with a route set](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/preview.png?v=20260910)

## Install

### With HACS

This card is not in the HACS default store, so add it as a custom repository.

1. **HACS → ⋮ (top right) → Custom repositories**
2. Repository: `https://github.com/alexluckett/tesla-card`
3. Type: **Dashboard**, then **Add**
4. Open **Tesla Card** from the list and choose **Download**
5. Restart Home Assistant, then hard-reload your browser (Ctrl/Cmd + Shift + R)

HACS downloads the built file to `config/www/community/tesla-card/` and serves it from
`/hacsfiles/tesla-card/tesla-card.js`. There is nothing to compile.

If your dashboards run in **storage mode** — the default, where you edit them through the UI —
HACS registers that resource for you. In **YAML mode** it cannot, so add it yourself under
`lovelace:` in `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /hacsfiles/tesla-card/tesla-card.js
      type: module
```

### Without HACS

Download `tesla-card.js` from the [latest release][releases] into `config/www/`, then add it
under **Settings → Dashboards → ⋮ → Resources** with URL `/local/tesla-card.js` and type
**JavaScript module**.

### If the card does not appear

Almost always a stale browser cache or a missing resource. Hard-reload first. If it still says
`Custom element doesn't exist: tesla-fleet-card`, check the resource is listed under
**Settings → Dashboards → ⋮ → Resources**.

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
- **Charging** — the gauge fills in green, and a slow sheen runs along it while energy flows.
- **Driving** — speed leads instead of charge.

![Parked, charging, driving and asleep](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/states.png?v=20260910)

The mark on the charge gauge is your **charge limit**, read from the car.

### Light and dark

Every colour comes from a Home Assistant token, so the card follows whatever theme is running.
Nothing is hard-coded.

![The same card on a dark and a light theme](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/themes.png?v=20260910)

The screenshots throughout use Pearl White; set `paint` to whichever of the seven your car is.

### Miles or kilometres

Tesla report range, odometer and speed in **miles**. Those sensors carry a device class, so
Home Assistant converts them to your unit system — and it maps the United Kingdom to metric.
That is right for temperature and rainfall and wrong for how far a car can go, because UK road
signs are in miles. Home Assistant has one unit switch for the whole installation and no way to
say "metric, except on the road".

The card does not second-guess that. It shows whatever Home Assistant sends, so **a UK
installation shows kilometres by default**. Set the units if you want road units:

```yaml
units: imperial   # miles and mph
units: metric     # kilometres
units: auto       # follow Home Assistant (the default)
```

That affects this card only. To fix the units everywhere — history graphs, other cards,
templates — override them per entity instead, under **Settings → Devices & services →
Entities**: open the sensor, then the cog, then **Unit of Measurement**. Do that for range,
estimated range, odometer, distance to arrival and speed. The card reads the unit Home
Assistant reports, so it follows a per-entity override without any further setting.

### Where it is

The integration reports latitude and longitude and nothing else — there is no address anywhere
in it. Naming a place would mean sending your car's exact position to a geocoding service, so
the card does not do that.



Tesla does not publish the road route, so nothing on the map pretends to be one.

![Driving with the map showing the bearing to the destination](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/map.png?v=20260910)

The map above is drawn from the coordinates and paths the card passes, including a trail the
card built from real history; Home Assistant renders the cartography itself, in your theme.
At a ten-minute poll a trail is a handful of fixes joined up, not a smooth track.

Left to itself, Home Assistant draws a map marker as a 48 pixel circle carrying the initials of
the entity name, so a Tesla Model Y arrives as a large **TMY** badge. The card shrinks the
marker to a dot and drops the lettering, keeping colour to say which is which: the accent for
the car, the text colour for where it is headed.

Home Assistant loads its map component only when something asks for it, so the card requests it
the first time it needs one. That means the map can appear a moment after the rest of the card
on a dashboard that has no other map on it. If it never appears, the card says why underneath:
the usual cause is the `Location` device tracker being disabled or not yet having reported.

The destination comes from the car's own navigation, not from your zones, so it works for
anywhere you drive: `Tesco Extra, Slough in 12 min` as readily as `Home in 20 min`. A full
postal address is reduced to its first part — `42 Kingsway Avenue` rather than the whole
thing with the postcode — and the arrival time is never what gets truncated. Hover the name
to see it in full.

To see the destination **by name**, enable one entity that the integration ships switched off:

**Settings → Devices → your car → +n entities → Destination → Enable**

Without it you still get `Arriving in 12 min · 23 miles`. The card tells you when it is missing.

### Controls

Off by default. Switched on, the card renders only the actions your integration actually
exposes, so a read-only setup never shows a dead button.

They show what they control rather than just offering a switch: the lock reads `Locked` or
`Unlocked`, climate shows its target temperature while it is running, and anything currently
active is tinted. So the row doubles as a second status line and is worth having on screen even
when you rarely press it.

![Controls at rest, and with charging, climate and sentry active](https://raw.githubusercontent.com/alexluckett/tesla-card/main/docs/controls.png?v=20260910)

Controlling a Tesla needs command signing set up in the integration; if you have not done that,
leave this off.

Tapping the card itself does nothing. Only buttons act.

## Options

| Option | Default | What it does |
| --- | --- | --- |
| `device_id` | — | The vehicle. Required. |
| `paint` | first for your body | Paint colour. Not reported by the integration. |
| `wheels` | first for your body | Wheels. Not reported by the integration. |
| `units` | `auto` | `auto` follows Home Assistant; `imperial` or `metric` pin it. |
| `map` | `navigating` | `navigating`, `always` or `never`. |
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

The render is fetched **once per configuration** and kept in the browser, so a dashboard left
open does not keep pulling it. Tesla serve the image with `cache-control: max-age=60`, which
would otherwise mean a fresh download every minute for as long as the page is up. The stored
copy is keyed by the image URL, so changing paint, wheels, angle or vehicle fetches once more
and evicts the old one; nothing else does. It also means the car still appears when Tesla is
unreachable.

To clear it, clear your browser's site data for Home Assistant.

## Building it yourself

You do not need to; releases ship built. If you want to:

```sh
npm install
npm test
npm run build
```

`npm run verify` runs lint, format, tests and the build together.

When the screenshots change, bump the `?v=` on the image URLs. GitHub proxies readme images
through a cache keyed by URL, and a URL pinned to a branch never changes, so a new picture
otherwise sits behind the old one. They stay absolute rather than relative because HACS renders
this readme inside Home Assistant, where a relative path has nothing to resolve against.

`test/harness.html` renders the card against a stubbed Home Assistant, `test/shot.html` renders
one state at a time for the screenshots above, and `test/anim-check.html` reports whether the
charging animation is actually running rather than merely present in the stylesheet. Serve the
repository over HTTP and open them; they load `dist/`, so build first.

## Licence

MIT

[fleet]: https://www.home-assistant.io/integrations/tesla_fleet/
[releases]: https://github.com/alexluckett/tesla-card/releases/latest
