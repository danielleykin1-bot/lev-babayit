# לב בבית | מחברים משפחות לעזרה הנכונה

לב בבית (Lev BaBayit) is a Hebrew, RTL-first web experience that helps family members and caretakers find suitable elder-care and assisted-living providers in Israel.

Built with AI-assisted development (Claude), directed and reviewed by me using QA methodology; the test strategy, documentation structure, and incident investigation are my own work.

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

### Phase 1: trustworthy MVP

1. Replace the demonstration records with a reviewed provider dataset. Store the source, last-verified date, service areas, languages, hours, accessibility details, and contact preferences for every listing.
2. Add a small backend for submissions and consent records. Validate and rate-limit requests server-side, encrypt sensitive data at rest, and keep an audit trail of consent, recipients, and deletion requests.
3. Add clear loading, empty, error, and success states. Validate Israeli phone numbers, make keyboard focus visible, and test the RTL layout with screen readers and larger text.
4. Add analytics that do not capture names or phone numbers: searches, filter usage, completed forms, provider contact clicks, and response time.

### Search and indexing

Start with predictable directory search before introducing AI. Normalize Hebrew input (spacing, punctuation, final letters, and common spelling variants), search provider name, service type, area, language, and availability, then rank exact matches above partial matches. Add filters for care type, location, response time, price information, and verification status.

For the first backend, PostgreSQL with full-text search plus `pg_trgm` is sufficient and keeps the data and index together. Add indexes on normalized provider name, service type, area, and verification status; refresh the search document whenever a provider changes. If the directory grows or needs typo tolerance across many fields, move the read model to Typesense or Meilisearch and rebuild it from the canonical database.

### Search agent (later)

An assistant can turn a family member's free-text description into structured filters and explain why results match. Keep retrieval grounded in the verified provider index: the agent should extract care type, area, urgency, language, and constraints, call the search API, and answer only from returned records. It should ask a clarifying question when information is missing, show verification dates, avoid medical or legal advice, and never invent provider details.

Add an evaluation set of realistic Hebrew requests before launch. Measure retrieval precision, missed suitable providers, clarification rate, and unsafe answers. Do not send names, phone numbers, or other identifying details to a model unless there is a documented legal and security basis.

### UI/UX improvements

- Make the primary journey available in one short mobile form, with a progress indicator and the option to call instead.
- Show a provider's verification date, available services, service area, languages, hours, and expected response time before revealing contact actions.
- Add sort controls, a no-results recovery path, saved comparison, and a persistent accessibility/contact affordance.
- Test with family caregivers and older adults, including low vision, keyboard-only, reduced-motion, and small-screen scenarios.
- Add privacy, accessibility, terms, and provider-disclosure pages. Explain exactly who receives a request and how long it is retained.

### Hosting and release

**Recommended free option: Cloudflare Pages.** It is a good fit for this Vite static frontend: connect the GitHub repository, use `npm run build` as the build command, set `dist` as the output directory, and deploy the `main` branch. It provides HTTPS, preview deployments, custom domains, and a free tier suitable for an early public prototype. Keep secrets and the future API on a separate server-side service; never put them in Vite client environment variables.

Suggested release setup:

1. Push the repository to GitHub and connect it to Cloudflare Pages.
2. Add a production environment only after replacing demo contact details and adding the privacy disclosures.
3. Configure a backend/API separately, with CORS restricted to the production domain and preview domains handled deliberately.
4. Add uptime checks, error tracking with PII scrubbing, automated builds, and a manual provider-data review before each release.

Vercel and Netlify are also suitable free alternatives for the static frontend. Confirm current free-tier limits and commercial-use terms before choosing a long-term host.

Before collecting real personal information, review Israeli privacy, accessibility, consumer-protection, data-retention, and consent requirements with qualified local counsel.

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
