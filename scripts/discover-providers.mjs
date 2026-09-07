import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import process from 'node:process'
import * as cheerio from 'cheerio'

const DEFAULT_OUTPUT = 'data/review/provider-candidates.json'
const MAX_RESPONSE_BYTES = 2_000_000
const DEFAULT_MAX_PAGES = 30
const DEFAULT_DELAY_MS = 750
const SERVICE_TERMS = ['סיעוד', 'מטפל', 'טיפול בבית', 'דיור מוגן', 'השגחה', 'קשיש', 'גריאטר']

function parseArguments(argumentsList) {
  const options = { seeds: [], output: DEFAULT_OUTPUT, maxPages: DEFAULT_MAX_PAGES, delayMs: DEFAULT_DELAY_MS }
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index]
    if (argument === '--seed') options.seeds.push(argumentsList[++index])
    else if (argument === '--output') options.output = argumentsList[++index]
    else if (argument === '--max-pages') options.maxPages = Number(argumentsList[++index])
    else if (argument === '--delay-ms') options.delayMs = Number(argumentsList[++index])
    else if (argument === '--help') options.help = true
    else throw new Error(`Unknown argument: ${argument}`)
  }
  return options
}

function printHelp() {
  console.log(`Usage: npm run discover:providers -- --seed https://example.org

Options:
  --seed URL       Approved starting URL; repeat for multiple domains
  --max-pages N    Maximum pages to fetch, default ${DEFAULT_MAX_PAGES}
  --delay-ms N     Delay between requests to one domain, default ${DEFAULT_DELAY_MS}
  --output PATH    Review queue output, default ${DEFAULT_OUTPUT}

This command only creates a human-review queue. It never updates the app or publishes providers.`)
}

function normalizeText(value = '') {
  return value.replace(/\s+/g, ' ').trim()
}

function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isRelevantText(text) {
  const normalized = text.toLowerCase()
  return SERVICE_TERMS.some((term) => normalized.includes(term))
}

function jsonLdObjects(value) {
  if (Array.isArray(value)) return value.flatMap(jsonLdObjects)
  if (value && typeof value === 'object') {
    const graph = Array.isArray(value['@graph']) ? value['@graph'].flatMap(jsonLdObjects) : []
    return [value, ...graph]
  }
  return []
}

function extractCandidate(pageUrl, html) {
  const $ = cheerio.load(html)
  const bodyText = normalizeText($('body').text())
  const jsonLd = []
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      jsonLd.push(...jsonLdObjects(JSON.parse($(element).text())))
    } catch {
      // Ignore malformed structured data and continue with visible metadata.
    }
  })
  const organization = jsonLd.find((item) => item.name && (item.telephone || item.email || item.address || item.url))
  const name = normalizeText(organization?.name || $('meta[property="og:site_name"]').attr('content') || $('title').text())
  const phone = normalizeText(organization?.telephone || $('a[href^="tel:"]').first().text())
  const description = normalizeText(organization?.description || $('meta[name="description"]').attr('content'))
  if (!name || (!organization && !isRelevantText(`${name} ${description} ${bodyText}`))) return null

  return {
    status: 'pending_human_review',
    name,
    phone: phone || null,
    url: pageUrl,
    description: description || null,
    area: organization?.areaServed || null,
    source: pageUrl,
    discoveredAt: new Date().toISOString(),
    review: {
      verified: false,
      reviewer: null,
      reviewedAt: null,
      notes: null,
    },
  }
}

async function readRobots(origin) {
  try {
    const response = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return []
    return (await response.text()).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  } catch {
    return []
  }
}

function allowedByRobots(lines, url) {
  let applies = false
  const path = new URL(url).pathname
  for (const line of lines) {
    const [key, rawValue = ''] = line.split(':', 2)
    const value = rawValue.trim()
    if (key.toLowerCase() === 'user-agent') applies = value === '*'
    if (applies && key.toLowerCase() === 'disallow' && value && path.startsWith(value)) return false
  }
  return true
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'LevBaBayitProviderDiscovery/1.0 (+human-review-only)' },
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return null
  const declaredSize = Number(response.headers.get('content-length') || 0)
  if (declaredSize > MAX_RESPONSE_BYTES) return null
  const reader = response.body?.getReader()
  if (!reader) return null
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return new TextDecoder().decode(Buffer.concat(chunks))
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) return printHelp()
  if (!options.seeds.length || options.seeds.some((seed) => !isHttpUrl(seed))) {
    throw new Error('At least one valid --seed http(s) URL is required')
  }
  if (!Number.isInteger(options.maxPages) || options.maxPages < 1) throw new Error('--max-pages must be a positive integer')
  const outputPath = resolve(options.output)
  if (!outputPath.startsWith(`${resolve('data/review')}${sep}`)) throw new Error('--output must remain inside data/review/')

  const queues = new Map()
  for (const seed of options.seeds) {
    const url = new URL(seed)
    queues.set(url.origin, { pending: [url.href], visited: new Set(), robots: await readRobots(url.origin), lastRequest: 0 })
  }
  const candidates = new Map()
  let pagesFetched = 0

  while (pagesFetched < options.maxPages && [...queues.values()].some((queue) => queue.pending.length)) {
    for (const [origin, queue] of queues) {
      const nextUrl = queue.pending.shift()
      if (!nextUrl || pagesFetched >= options.maxPages) continue
      if (queue.visited.has(nextUrl) || !allowedByRobots(queue.robots, nextUrl)) continue
      queue.visited.add(nextUrl)
      const wait = options.delayMs - (Date.now() - queue.lastRequest)
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
      queue.lastRequest = Date.now()
      try {
        const html = await fetchHtml(nextUrl)
        pagesFetched += 1
        if (!html) continue
        const candidate = extractCandidate(nextUrl, html)
        if (candidate) candidates.set(`${candidate.name.toLowerCase()}|${origin}`, candidate)
        const $ = cheerio.load(html)
        $('a[href]').each((_, link) => {
          try {
            const linkedUrl = new URL($(link).attr('href'), nextUrl)
            if (linkedUrl.origin === origin && (linkedUrl.protocol === 'http:' || linkedUrl.protocol === 'https:')) {
              linkedUrl.hash = ''
              if (!queue.visited.has(linkedUrl.href) && queue.pending.length < options.maxPages * 2) queue.pending.push(linkedUrl.href)
            }
          } catch {
            // Ignore invalid links.
          }
        })
      } catch (error) {
        console.warn(`Skipped ${nextUrl}: ${error.message}`)
      }
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    humanReviewRequired: true,
    autoPublish: false,
    pagesFetched,
    candidates: [...candidates.values()],
  }
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${output.candidates.length} candidate(s) from ${pagesFetched} page(s) to ${outputPath}`)
  console.log('No application or production database was changed. Every candidate requires human review.')
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})