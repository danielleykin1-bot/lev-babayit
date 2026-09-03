# לב בבית | Early Test Plan

This plan covers the first test phase for the Lev BaBayit provider directory and care-request flow. It is intentionally focused on the highest-risk user journeys: finding a provider, understanding what will happen, and submitting personal information with consent.

## Goals

- Confirm that families can find relevant providers quickly.
- Confirm that the intake form handles invalid, incomplete, and successful submissions correctly.
- Protect names and phone numbers from accidental exposure.
- Keep the Hebrew RTL experience usable on mobile, desktop, and assistive technology.
- Catch regressions automatically on every pull request.

## Test environments

### Local

Run the Vite frontend locally with mocked provider data and a local or mocked API. Use fake names, phone numbers, and provider records only.

### Pull-request preview

Deploy each pull request to a Cloudflare Pages preview URL. Point it at a disposable staging API and seeded fake provider data. Playwright can run against this URL after deployment.

### Staging

Use a separate Supabase project or equivalent PostgreSQL-backed service for staging. Keep its database, API keys, provider records, and environment variables separate from production. Never copy real submissions into staging.

### Production

Use the production Cloudflare Pages deployment and production backend only for smoke checks with synthetic data. Do not use real personal information for automated tests.

## Automated tests

### Unit and component tests

Use Vitest and React Testing Library to cover:

- Hebrew search normalization and matching
- Provider name, service type, and area filtering
- `כל הארץ` matching all relevant areas
- Empty search results
- Provider contact expansion and `aria-expanded`
- Required fields, phone validation, and consent handling
- Successful and unsuccessful submission states
- RTL labels, phone links, and keyboard focus behavior

### Browser tests

Use Playwright for the critical journeys:

1. Load the homepage on desktop and mobile.
2. Navigate from the hero CTA to the intake form.
3. Reject a submission with missing fields or missing consent.
4. Submit a valid request and verify the confirmation state.
5. Search by provider name and service type.
6. Filter by geographic area.
7. Expand a provider phone number and verify the `tel:` link.
8. Verify RTL direction, mobile layout, and absence of console errors.

Start with Chromium on every pull request. Add Firefox and WebKit coverage once the main flow is stable.

### Accessibility automation

Use axe-core through Playwright or `jest-axe` to check:

- Form labels, required states, and button names
- Color contrast and heading hierarchy
- Keyboard navigation and visible focus
- Expanded/collapsed control states
- RTL rendering and document language

Automated checks supplement manual screen-reader testing; they do not replace it.

## Manual test pass

Before each early release, test with Chrome and Firefox on desktop, Safari and Chrome on iOS, and a 320px-wide viewport. Also test browser zoom at 200%, large text, keyboard-only navigation, VoiceOver or NVDA, reduced-motion settings, invalid Israeli phone formats, long Hebrew names, long provider names, empty results, slow networks, and phone links on a real mobile device.

Have at least one caregiver or older adult complete the flow without guidance. Observe whether they understand what information is shared, who may call them, and what happens after submission.

## Privacy and data tests

- Verify names and phone numbers never appear in browser, server, or analytics logs.
- Verify consent is required before a submission is accepted.
- Verify the API rejects malformed, oversized, and rate-limited requests.
- Verify provider listings expose their verification date and source state.
- Verify documented deletion and retention behavior.
- Verify error tracking scrubs personal information.

## Release gate

Do not release until:

- `npm run build` and `npm run lint` pass.
- Unit/component tests pass.
- Critical Playwright paths pass.
- No high-severity accessibility findings remain.
- Manual mobile, keyboard, and assistive-technology checks pass.
- Privacy checks confirm personal data follows only the intended backend path.

## Future coverage

Expand coverage when backend features arrive: provider onboarding, verification updates, availability changes, deletion requests, email/CRM dispatch, search indexing, agent retrieval quality, and security testing for authentication and API authorization.