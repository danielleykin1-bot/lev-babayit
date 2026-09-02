# לב בבית

לב בבית is a Hebrew, RTL-first web experience that helps family members and caretakers find suitable elder-care and assisted-living providers in Israel.

The current repository contains the first product prototype: a responsive intake flow, a searchable provider directory, area filtering, provider contact actions, and a consent-gated submission confirmation.

## What is included

- Hebrew-first responsive interface for desktop and mobile
- Care request form with name, phone, care type, and consent fields
- Search by provider name or service type
- Area filters for מרכז, ירושלים, השרון, and all areas
- Provider cards with service area, rating, response time, and expandable phone contact
- Accessible controls with labels, button titles, and `aria-expanded` state
- Calm, care-focused visual language using Assistant and Frank Ruhl Libre

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`.

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run lint     # Run Oxlint
npm run preview  # Preview the production build locally
```

## Project structure

- `src/App.jsx` - application UI, intake state, search/filter behavior, and provider data
- `src/App.css` - responsive layout and visual styling
- `src/index.css` - global reset and typography defaults
- `public/` - static assets served by Vite

## Current prototype limitations

The provider directory uses demonstration records. Phone numbers, ratings, availability, and company coverage must be verified before publishing. The form currently shows a local confirmation state; it does not yet send personal details to external companies or store submissions.

## Recommended production work

1. Add a secure backend for submissions and consent records.
2. Replace demonstration providers with verified Israeli companies and current contact details.
3. Add provider onboarding, verification, availability updates, and opt-out controls.
4. Add secure dispatch through an approved email, CRM, or provider API integration.
5. Review Israeli privacy, accessibility, and data-retention requirements before launch.

## Technology

React 19, Vite, Lucide React, and Oxlint.
