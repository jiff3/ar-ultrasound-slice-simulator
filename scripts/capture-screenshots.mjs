import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { chromium } from 'playwright'

const APP_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173'
const VIEWPORT = { width: 1440, height: 1000 }
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const screenshotDir = path.join(rootDir, 'public', 'screenshots')

await mkdir(screenshotDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  deviceScaleFactor: 1,
  viewport: VIEWPORT,
})

try {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 15_000 })
} catch (error) {
  await browser.close()
  throw new Error(
    `Could not reach ${APP_URL}. Start the app with "npm run dev" before running screenshots.\n${String(
      error,
    )}`,
  )
}

await page.waitForSelector('.canvas-frame canvas', { timeout: 20_000 })
await page.waitForSelector('.side-panel', { timeout: 20_000 })
await page.waitForFunction(() => {
  const canvas = document.querySelector('.canvas-frame canvas')

  return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0
})
await page.waitForTimeout(2_500)

await captureScreenshot('main-simulator.png')

const wrongOrientationToggle = page.getByLabel('Wrong orientation comparison')
if (!(await wrongOrientationToggle.isChecked())) {
  await wrongOrientationToggle.check()
}

await page.waitForSelector('.comparison-panel', { timeout: 10_000 })
await page.waitForTimeout(800)
await captureScreenshot('orientation-comparison.png')

await browser.close()

console.log(`Screenshots written to ${path.relative(rootDir, screenshotDir)}`)

async function captureScreenshot(fileName) {
  await page.screenshot({
    fullPage: false,
    path: path.join(screenshotDir, fileName),
  })
}
