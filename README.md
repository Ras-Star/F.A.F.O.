# F.A.F.O

This project now ships an offline-friendly Bootstrap adventure with the in-app title **Signal Academy: Blackout Protocol**.

## Highlights

- Bootstrap-first single-page layout with a welcome flow, live mission HUD, guided hints, accordion panels, offcanvas log, toast feedback, and ending modal
- Teen-focused sci-fi branching story with longer progression, multiple endings, and stats that shape available routes
- Local Bootstrap assets served from `vendor/bootstrap`, so the experience works without a CDN
- Lightweight Node server with no runtime dependencies beyond the local Bootstrap package already installed

## Setup

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Offline note

After `npm install`, the `postinstall` script copies Bootstrap CSS and JS from
`node_modules` into `vendor/bootstrap`. The game runs entirely from local files.
