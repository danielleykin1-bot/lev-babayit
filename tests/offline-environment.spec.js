import { test, expect } from '@playwright/test'

test('production-shaped test environment stays local and offline', async ({ page, baseURL }) => {
  const externalRequests = []
  const appOrigin = new URL(baseURL).origin

  await page.route('**/*', async (route) => {
    const requestOrigin = new URL(route.request().url()).origin
    if (requestOrigin !== appOrigin) {
      externalRequests.push(route.request().url())
      await route.abort()
      return
    }
    await route.continue()
  })

  await page.goto('/')

  await expect(page.locator('main')).toBeVisible()
  await expect(page.getByText('רשומת הדגמה - טרם אומתה').first()).toBeVisible()
  expect(externalRequests).toEqual([])
})