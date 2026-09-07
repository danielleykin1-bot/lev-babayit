# Provider Discovery Bot

`npm run discover:providers -- --seed https://example.org` runs a conservative web discovery crawler. It is a research tool, not an importer.

## Safety boundary

The crawler:

- Crawls only explicitly supplied HTTP(S) seed domains and same-origin links.
- Reads `robots.txt`, uses a descriptive user agent, rate-limits requests, and applies request timeouts.
- Rejects non-HTML responses and responses over 2 MB.
- Extracts possible organization details and writes them only to `data/review/provider-candidates.json`.
- Marks every record `pending_human_review` and sets `autoPublish: false` in the output.

The crawler has no database credentials and never edits `src/App.jsx`, the production provider index, or any production service. Do not add credentials to this script or its command line.

## Human review process

1. Run the crawler with approved seed URLs.
2. Inspect every candidate against the original source website.
3. Verify company identity, phone number, services, coverage, languages, hours, accessibility, and current contact consent.
4. Record the reviewer, date, sources, and notes.
5. Only a separate, deliberate data-maintainer process may export reviewed records into a future canonical database.

There is intentionally no `--publish` flag. A crawler run can create suggestions, never live listings.

## Example

```bash
npm run discover:providers -- \
  --seed https://approved-provider-directory.example.il \
  --max-pages 20 \
  --output data/review/provider-candidates.json
```

Use only websites that permit this access and confirm applicable terms, privacy rules, copyright, and Israeli data-protection obligations before operating the bot.