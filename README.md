# F.A.F.O

**F.A.F.O** is an offline-friendly browser game project whose in-app title is
**Signal Academy: Blackout Protocol**. It is a Bootstrap-first interactive
story game built with plain HTML, CSS, and JavaScript, then served locally
through a tiny Node server.

## What The Game Is

You play through a teen-focused sci-fi blackout scenario where your choices
shape:

- which clues you uncover
- how much your crew trusts you
- how safely you reach the ending
- whether the final signal becomes a rescue, a reveal, or both

The latest version includes:

- a proper welcome screen and mission briefing
- guided hints and current objectives while playing
- more game-like HUD styling and animated atmosphere
- branching scenes and multiple endings
- a local-only Bootstrap setup with no CDN dependency

## Run Locally

Install dependencies and start the local server:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Project Structure

```text
index.html              Main Bootstrap-based UI shell
styles.css              Custom visual layer on top of Bootstrap
game.js                 Story state, choices, rendering, and UI updates
server.js               Small static file server
scripts/copy-bootstrap.js
vendor/bootstrap/       Local Bootstrap CSS and JS copied after install
```

## How Bootstrap Is Used

Bootstrap is not just linked in for styling. The app is structured around
Bootstrap layout, utilities, and JavaScript components.

### 1. Layout And Responsiveness

Bootstrap handles the main page structure with:

- `.container` for the centered app shell
- `.row` and `.col-*` for responsive panel layout
- spacing utilities like `.p-*`, `.mb-*`, `.mt-*`, `.gap-*`, `.py-*`
- flex utilities like `.d-flex`, `.justify-content-between`, `.align-items-*`
- responsive visibility and sizing patterns used across the welcome and game HUD

### 2. Core Bootstrap Components In The Game

The UI relies on these Bootstrap components:

- **Cards** for the welcome panel, story panel, HUD blocks, and ending summary
- **Buttons** for mission actions, restart controls, guide toggles, and navigation
- **Badges** for chapter, status, ending labels, and category chips
- **Progress bars** for mission progress and stat meters
- **Accordion** for inventory, squad stats, and quick tips
- **Collapse** for the "How To Play" / mission guide panel
- **Offcanvas** for the mission log side panel
- **Toast** for moment-to-moment mission feedback after choices
- **Modal** for ending results and summary highlights
- **List groups** for inventory rows and brief items

### 3. Bootstrap JavaScript Behavior

The local Bootstrap bundle powers all interactive Bootstrap behavior:

- collapse open/close behavior
- offcanvas mission log behavior
- toast notifications
- ending modal display

The bundle is loaded from:

```html
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
```

That means the project does **not** rely on an internet connection for
Bootstrap JS features.

### 4. Custom CSS On Top Of Bootstrap

Bootstrap provides the structure and the base component system. The custom
`styles.css` file adds the game's identity layer:

- animated starfield and scan-grid background
- glowing HUD panels and glassmorphism-style cards
- scene transition flashes
- animated choice cards and telemetry chips
- custom color palette and atmosphere for the teen sci-fi theme

In short:

- **Bootstrap** = layout, components, responsive behavior, interactive UI primitives
- **Custom CSS** = theme, effects, motion, mood, and game feel

## Local Bootstrap Workflow

Bootstrap is installed from npm and copied into the local `vendor/` directory
after install so the game can run fully offline.

`package.json` includes:

```json
{
  "scripts": {
    "start": "node server.js",
    "postinstall": "node scripts/copy-bootstrap.js"
  }
}
```

The copy step pulls files from `node_modules/bootstrap/` into:

- `vendor/bootstrap/css/bootstrap.min.css`
- `vendor/bootstrap/js/bootstrap.bundle.min.js`

## Why This Setup

This structure is useful for classwork and small game projects because it keeps:

- the code simple
- the UI framework local
- the runtime dependency footprint low
- the project easy to host and demo

## Notes

- The repository name remains **F.A.F.O**, while the game shown in the browser is
  **Signal Academy: Blackout Protocol**.
- `game.js` controls the story flow and updates the Bootstrap-driven UI in place.
- `styles.css` is intentionally layered over Bootstrap rather than replacing it.
