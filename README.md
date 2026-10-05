# Mahotsav Crafts

Mahotsav Crafts is a mobile-first artisan directory and stall-card tool for cultural fairs. Visitors can discover makers, learn about their crafts, and contact or share their profiles. Organizers can create printable QR cards that direct visitors to artisan pages.

## Problem statement

At a busy fair, visitors may see an artisan's work without learning the maker's name, craft tradition, or story. It can also be difficult to keep the maker's contact details after the event. Organizers need a simple way to connect each stall sign to a useful, shareable artisan profile.

Mahotsav Crafts addresses this with searchable maker profiles and scannable stall cards, helping visitors discover and remember the people behind the work.

## Current features

- Search artisans by name, craft, location, and stall number; filter by craft category.
- Open shareable, hash-routed artisan profiles with a story and product gallery.
- Contact artisans through WhatsApp or phone, save a contact card, and share a profile link.
- Generate a QR code in the browser and print a 4 × 6 inch stall card.
- Responsive layouts for mobile and desktop.

The app currently includes five sample artisan profiles and local demo images.

## Tech stack

- React and TypeScript
- Vite
- Wouter with hash-based routing
- `qrcode.react` for client-side QR code rendering
- Lucide React icons and responsive CSS
- pnpm workspace monorepo

## Run locally

From the workspace root:

```sh
pnpm --filter @workspace/mahotsav-crafts run dev
```

Useful routes:

- `/#/` — artisan directory
- `/#/artisan/101` — sample artisan profile
- `/#/admin` — stall-card studio

## Roadmap

### Completed: runnable MVP

- Mobile-first directory, artisan profile pages, contact and sharing actions.
- Client-side QR generation and printable stall-card layout.
- Sample artisan data and images for previewing the experience.

### Next: shared artisan records

- Connect the directory and organizer tools to a persistent API and database.
- Let organizers create and update complete artisan profiles, rather than only previewing card details in local page state.
- Generate QR cards from saved profiles so a scan opens the matching profile on any device.

### Before public use

- Replace sample profiles and contact numbers with verified artisan information.
- Add organizer sign-in and permissions before enabling shared profile editing.
- Test printed cards at the intended 4 × 6 inch size and verify contact and sharing actions on real mobile devices.

## Current limitations

Artisan records are local demo data; they are not saved to a database. Organizer card edits do not persist, and a QR code for an ID without a matching artisan record will not open a profile.
