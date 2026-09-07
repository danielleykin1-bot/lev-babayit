# Development Activity Log

This log records the development work completed for Lev BaBayit and the current state of the prototype. Dates follow the repository commit history.

## 2026-09-02

- Initialized the Vite and React project.
- Built the first Hebrew, RTL-first caregiving provider-matching prototype.
- Added the responsive hero, intake form, provider directory, search, area filtering, contact actions, and local submission confirmation.
- Added accessible labels, button titles, and expanded-state behavior for provider contact controls.
- Documented the product identity and prototype scope.

## 2026-09-03

- Added the early test plan covering unit and component tests, Playwright journeys, accessibility checks, manual testing, privacy checks, and release gates.
- Documented that development was initially performed in GitHub Codespaces with AI-assisted development, directed and reviewed using QA methodology.
- Recorded that the test strategy, documentation structure, and incident investigation are the author's own work.
- Extracted the product roadmap into [ROADMAP.md](ROADMAP.md) and linked it from the README.

## 2026-09-07

- Added provider metadata fields for source, verification date, languages, hours, accessibility, and contact preference.
- Displayed provider verification status and expanded metadata in the provider cards.
- Marked the current records as internal demonstration data that must be verified before publication.
- Added an isolated, production-shaped test environment using Playwright and Vite test mode.
- Added `.env.test` with no secrets and no API endpoint.
- Configured the browser test to allow same-origin requests only and abort external requests.
- Removed the external Google Fonts import from test-mode builds so the offline test bundle has no external font dependency.
- Added documentation in [TEST_ENVIRONMENT.md](TEST_ENVIRONMENT.md) and linked it from the README.

## Validation

The following checks pass locally:

- `npm run lint`
- `npm run build`
- `npm run build -- --mode test`
- `npx playwright test --list`
- `git diff --check`

The browser test is configured but cannot execute in the current container until the system GTK library `libatk-1.0.so.0` is available. The test environment itself remains configured to run locally and block external requests.

## Current state and next work

The application is still a static prototype. Provider records are demonstration data, the form stores only local UI state, and no real submission backend or production provider verification workflow exists yet. The next roadmap work should add a local or disposable backend contract for submissions and consent records, with server-side validation and rate limiting before any production integration.
