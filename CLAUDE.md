# Tall Order

An original tower-building sim (single-page web game), installed on iPhone as a Home Screen web app and hosted on GitHub Pages from this repo's `main` branch, root folder.

## Files
- `index.html` — the whole game: markup, CSS and JavaScript in one file. This is the source of truth.
- `sw.js` — service worker for offline play.
- `manifest.webmanifest`, `icon-*.png` — Home Screen app metadata and icons.

## Rules when changing the game
- **Bump `VERSION` in `sw.js` on every change to `index.html`** (e.g. `tall-order-v8` → `tall-order-v9`), or phones keep serving the old cached copy.
- Keep it one self-contained `index.html`. No build step, no frameworks, no bundler. The only external request is Google Fonts, and the game must still work offline without them.
- Never break saves. Saves live in `localStorage` under `tall-order-save-v1` and as copyable save codes. If the save format changes, migrate old saves in `deserialize()` rather than rejecting them.
- Must work both with a mouse on desktop and with touch on an iPhone held sideways. Touch input is handled separately from mouse input (`tDown` / `tMove` / `tUp`): one finger pans, two fingers pinch, build tools drop a ghost that is confirmed with the Build button.
- Push to `main` to deploy; GitHub Pages updates in a minute or two.

## How the game is organised (inside index.html)
- `DEFS` — every buildable item: cost, size, star level, rent, description.
- Floors: internal floor index `f` is shown as `f+1` ("1F" is `f=0`; basements are negative). Sky lobbies sit on shown floors 15, 30, 45, 60, 75, 90 and 99 (`SKY_LOBBIES`).
- Two grids: `R.grid` holds rooms; `R.egrid` holds elevators, stairs and escalators, which sit in front of rooms and can pass through them.
- Simulation runs in 5-second game steps (`simStep`) with a timed event heap. People make real trips; routes are found over floor segments and transit links (`rebuildGraph`, `route`).
- Elevators: per-floor up/down queues, multiple cars, stops toggled in the panel, and stretched by dragging (desktop) or by the round grips (touch).
- Ratings come from trip times, rent level, parking, clinic and recycling. Low-rated tenants leave at quarter end (every 3 game days).
- Stars: requirements are in `REQ`; checked nightly at 22:00.

## Testing
No test framework. Check changes by opening `index.html` in a browser (or with Playwright, emulating an iPhone in landscape with touch), and run the simulation for a few game days to confirm there are no console errors.
