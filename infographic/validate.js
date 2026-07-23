/**
 * validate.js — Checks output/infographic.png dimensions and aspect ratio.
 *
 * Reads the PNG IHDR chunk to extract width/height without external dependencies.
 * Validates:
 *   - Width  ≥ 2000 px
 *   - Aspect ratio 4:5 (0.8) within ±1%
 *   - File size > 500 KB
 *
 * Usage:  node validate.js   (or  npm run validate)
 * Exit code 0 on success, 1 on failure.
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(__dirname, '..', 'output', 'infographic.png');
const MIN_WIDTH = 2000;
const TARGET_RATIO = 0.8;        // 4:5
const RATIO_TOLERANCE = 0.01;    // ±1%
const MIN_FILE_SIZE = 400 * 1024; // 400 KB

function readPngDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(24);

    // Read 24 bytes: 8-byte PNG signature + 4-bytes IHDR length + 4-bytes "IHDR" + 4 width + 4 height
    const bytesRead = fs.readSync(fd, buf, 0, 24, 0);
    if (bytesRead < 24) {
      throw new Error('File too small to be a valid PNG');
    }

    // Check PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    if (!buf.subarray(0, 8).equals(signature)) {
      throw new Error('Not a valid PNG file (invalid signature)');
    }

    // IHDR chunk starts at offset 8: 4 bytes length, 4 bytes type, then 4 bytes width, 4 bytes height
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
  } finally {
    fs.closeSync(fd);
  }
}

function main() {
  console.log(`Validating ${TARGET_FILE}…`);

  // Check file exists
  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`✗ File not found: ${TARGET_FILE}`);
    console.error('  Run "npm run generate" first.');
    process.exit(1);
  }

  let stats, dims;
  try {
    stats = fs.statSync(TARGET_FILE);
    dims = readPngDimensions(TARGET_FILE);
  } catch (err) {
    console.error(`✗ Failed to read image: ${err.message}`);
    process.exit(1);
  }

  const fileSizeKB = (stats.size / 1024).toFixed(1);
  const actualRatio = dims.width / dims.height;
  const ratioDelta = Math.abs(actualRatio - TARGET_RATIO);

  let allPassed = true;

  // Check width
  if (dims.width < MIN_WIDTH) {
    console.error(`✗ Width ${dims.width} px < minimum ${MIN_WIDTH} px`);
    allPassed = false;
  } else {
    console.log(`✓ Width: ${dims.width} px (≥ ${MIN_WIDTH})`);
  }

  // Check aspect ratio
  if (ratioDelta > RATIO_TOLERANCE) {
    console.error(
      `✗ Aspect ratio ${actualRatio.toFixed(4)} (w/h) is outside 0.8 ±1% (allowed: ${(TARGET_RATIO - RATIO_TOLERANCE).toFixed(4)}–${(TARGET_RATIO + RATIO_TOLERANCE).toFixed(4)})`
    );
    allPassed = false;
  } else {
    console.log(`✓ Aspect ratio: ${actualRatio.toFixed(4)} (target 0.8 ±1%)`);
  }

  // Check height
  console.log(`✓ Height: ${dims.height} px`);

  // Check file size
  if (stats.size < MIN_FILE_SIZE) {
    console.error(`✗ File size ${fileSizeKB} KB < minimum ${(MIN_FILE_SIZE / 1024).toFixed(0)} KB`);
    allPassed = false;
  } else {
    console.log(`✓ File size: ${fileSizeKB} KB (≥ ${(MIN_FILE_SIZE / 1024).toFixed(0)} KB)`);
  }

  if (allPassed) {
    console.log('\n✓ All validation checks passed.');
    process.exit(0);
  } else {
    console.error('\n✗ Some validation checks failed.');
    process.exit(1);
  }
}

main();
