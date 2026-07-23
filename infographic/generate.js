/**
 * generate.js — Puppeteer screenshot script
 *
 * Captures infographic/index.html at 1200×1500 viewport with deviceScaleFactor 2
 * and saves the resulting 2400×3000 PNG to output/infographic.png.
 *
 * Uses @sparticuz/chromium to provide a self-contained Chromium binary
 * that includes all required system libraries.
 *
 * Usage:  node generate.js   (or  npm run generate)
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 1500;
const DEVICE_SCALE_FACTOR = 2;
const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'infographic.png');
const HTML_FILE = path.resolve(__dirname, 'index.html');

(async () => {
  let browser;
  try {
    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Dynamically import ESM-only @sparticuz/chromium
    const ChromiumModule = await import('@sparticuz/chromium');
    const Chromium = ChromiumModule.default;

    // Manually set up the AL2023 library environment (not auto-detected outside Lambda)
    const { setupLambdaEnvironment } = ChromiumModule;
    const al2023LibPath = path.join(os.tmpdir(), 'al2023', 'lib');
    setupLambdaEnvironment(al2023LibPath);

    // Also extract al2023.tar.br if it hasn't been extracted yet
    const { inflate } = ChromiumModule;
    const al2023Archive = path.join(__dirname, 'node_modules', '@sparticuz', 'chromium', 'bin', 'al2023.tar.br');
    if (fs.existsSync(al2023Archive) && !fs.existsSync(al2023LibPath)) {
      console.log('Extracting AL2023 system libraries…');
      await inflate(al2023Archive);
    }

    // Extract the bundled Chromium binary (includes all required libs)
    console.log('Preparing Chromium binary…');
    const executablePath = await Chromium.executablePath();
    console.log(`Chromium ready at: ${executablePath}`);

    const puppeteer = require('puppeteer');

    console.log('Launching headless Chromium…');
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: Chromium.args,
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR
    });

    const fileUrl = `file://${HTML_FILE}`;
    console.log(`Loading ${fileUrl}…`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Ensure all fonts and styles are fully rendered
    await page.evaluate(() => document.fonts.ready);

    console.log(`Capturing screenshot to ${OUTPUT_FILE}…`);
    await page.screenshot({
      path: OUTPUT_FILE,
      type: 'png',
      fullPage: false, // exact viewport; page is sized to 1200×1500
      omitBackground: false
    });

    const expectedWidth = VIEWPORT_WIDTH * DEVICE_SCALE_FACTOR;
    const expectedHeight = VIEWPORT_HEIGHT * DEVICE_SCALE_FACTOR;
    console.log(`✓ Screenshot saved — expected dimensions: ${expectedWidth}×${expectedHeight} px`);
    console.log(`  Output: ${OUTPUT_FILE}`);

  } catch (err) {
    console.error('✗ Screenshot generation failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
