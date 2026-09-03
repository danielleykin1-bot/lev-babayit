# לב בבית | מחברים משפחות לעזרה הנכונה

לב בבית (Lev BaBayit) is a Hebrew, RTL-first web experience that helps family members and caretakers find suitable elder-care and assisted-living providers in Israel.

Initially built in GitHub Codespaces with AI-assisted development, directed and reviewed by me using QA methodology; the test strategy, documentation structure, and incident investigation are my own work.

Suggested public URL: `github.com/danielleykin1-bot/lev-babayit`

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

## Recommended development roadmap

The planned product, search, UX, and hosting work is documented in [ROADMAP.md](ROADMAP.md).

## Early test plan

The proposed test strategy is documented in [TEST_PLAN.md](TEST_PLAN.md). It covers:

- Vitest and React Testing Library tests for search, filtering, forms, consent, and accessible states
- Playwright browser tests for the critical desktop, mobile, and RTL journeys
- Automated accessibility checks with axe-core, plus manual screen-reader and keyboard testing
- Manual browser, viewport, zoom, reduced-motion, phone-link, and caregiver usability checks
- Privacy and data-handling tests using fake data only outside production
- Local, pull-request preview, staging, and production test environments

The initial release gate is: build and lint pass, critical Playwright flows pass, no high-severity accessibility findings remain, manual mobile and keyboard checks pass, and personal data is confirmed to travel only through the intended backend path.

## Technology

React 19, Vite, Lucide React, and Oxlint.
