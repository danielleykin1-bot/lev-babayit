# Isolated Test Environment

The end-to-end test environment is a production-shaped build of the same Vite application. It uses the test mode, serves locally on `127.0.0.1`, and contains only deterministic demonstration data.

## Run it

Install dependencies and run the offline browser check:

```bash
npm install
npm run test:e2e
```

The test command builds with `--mode test`, starts the generated `dist/` output with Vite Preview, and runs Chromium against that local server.

## Isolation rules

- `.env.test` contains no secrets and has an empty API base URL.
- The browser harness allows same-origin requests only. External requests are aborted and fail the test.
- No real names, phone numbers, provider records, submissions, analytics, or production credentials may be added to test fixtures.
- When a backend is introduced, test mode must use a local mock or disposable seeded service. It must never inherit production environment variables.
- The Google Fonts import is intentionally blocked by the harness; the application must remain usable with its fallback fonts.

This environment verifies the production bundle without sending test data to external sources.