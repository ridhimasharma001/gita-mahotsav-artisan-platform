# Mahotsav Crafts

A mobile-first directory for artisans at cultural fairs, with shareable maker profiles, contact actions, and printable stall QR cards.

## Run & Operate

- `pnpm --filter @workspace/mahotsav-crafts run dev` — run the app preview
- `pnpm --filter @workspace/mahotsav-crafts run typecheck` — typecheck the app
- `pnpm --filter @workspace/mahotsav-crafts run build` — build the app (`PORT` and `BASE_PATH` are required by Vite config)

## Stack

- React, TypeScript, Vite, and Wouter hash-based routing
- QR rendering with `qrcode.react`; generated QR codes stay in the browser
- Local demo data and generated craft imagery; no artisan database is connected yet

## Where things live

- `artifacts/mahotsav-crafts/src/artisan_data.ts` — demo artisan records
- `artifacts/mahotsav-crafts/public/` — local cover, portrait, and product images
- `artifacts/mahotsav-crafts/src/App.tsx` — directory, profile, and QR studio routes
- `artifacts/mahotsav-crafts/src/index.css` — theme, responsive layout, and 4 × 6 print styling

## Architecture decisions

- The artisan directory is intentionally backed by in-memory demo records; admin QR details are not saved to a database.
- Hash routing keeps artisan URLs scannable and reloadable as `/#/artisan/<id>`.

## Product

Visitors can search and filter artisans, browse stories and product galleries, contact makers, save contacts, and share profile links. Organizers can create a QR stall card and print it at 4 × 6 inches.

## User preferences

Use the warm terracotta, muted gold, off-white, and slate palette specified for this app.

## Gotchas

- The build script loads Vite configuration that requires both `PORT` and `BASE_PATH`; set them when running the build directly from a shell.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
