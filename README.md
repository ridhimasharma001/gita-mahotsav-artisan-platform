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
- Let artisans register or sign in, then create and edit their public maker page.
- Store maker pages in Firestore; public visitors can browse them, while only the signed-in owner can create or edit their own listing.
- Responsive layouts for mobile and desktop.

The directory also includes five sample artisan profiles and local demo images.

## Tech stack

- React and TypeScript
- Vite
- Wouter with hash-based routing
- Firebase Authentication (email/password) and Cloud Firestore
- React Hook Form and Zod for validated account and listing forms
- `qrcode.react` for client-side QR code rendering
- Lucide React icons and responsive CSS
- pnpm workspace monorepo

## Firebase setup

Create a Firebase project and web app, then add these values through Replit Secrets:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

In Firebase Console, enable **Email/Password** under Authentication and create a Cloud Firestore database. Deploy the included security rules from the workspace root with:

```sh
firebase deploy --only firestore:rules
```

The rules allow public reads for the maker directory and restrict listing creation and edits to the authenticated owner. Artisan pages display their contact phone publicly. Cover, portrait, and product images are currently entered as image URLs; uploads are not enabled.

## Run locally

From the workspace root:

```sh
pnpm --filter @workspace/mahotsav-crafts run dev
```

Useful routes:

- `/#/` — artisan directory
- `/#/artisan/101` — sample artisan profile
- `/#/admin` — stall-card studio
- `/#/sign-in` and `/#/sign-up` — artisan account access
- `/#/my-shop` — create or edit your maker page (requires Firebase setup)

## Roadmap

### Completed: runnable MVP

- Mobile-first directory, artisan profile pages, contact and sharing actions.
- Client-side QR generation and printable stall-card layout.
- Sample artisan data and images for previewing the experience.

### Next: organizer workflow

- Add organizer sign-in and permissions for shared artisan record management.
- Let organizers create and update complete artisan profiles, rather than only previewing card details in local page state.
- Generate QR cards from saved profiles so a scan opens the matching profile on any device.

### Before public use

- Replace sample profiles and contact numbers with verified artisan information.
- Add organizer sign-in and permissions before enabling organizer profile editing.
- Test printed cards at the intended 4 × 6 inch size and verify contact and sharing actions on real mobile devices.

## Current limitations

The sample artisan records are local demo data; newly created artisan pages are saved to Firestore. Organizer card edits do not persist, and a QR code for an ID without a matching artisan record will not open a profile.
