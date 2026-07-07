const zlib = require('zlib');
const fs = require('fs');

// Create a simple 128x128 RGBA PNG with a blue circle
const width = 128, height = 128;

// Build raw pixel data (filtered)
let raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y++) {
    const rowOff = y * (width * 4 + 1);
    raw[rowOff] = 0; // filter: none
    for (let x = 0; x < width; x++) {
        const dx = x - width/2;
        const dy = y - height/2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const off = rowOff + 1 + x * 4;
        if (dist < 52) {
            raw[off] = 30;     // R
            raw[off+1] = 80;   // G
            raw[off+2] = 190;  // B
            raw[off+3] = 230;  // A
        } else if (dist < 58) {
            raw[off] = 20;
            raw[off+1] = 50;
            raw[off+2] = 140;
            raw[off+3] = 200;
        } else {
            raw[off] = 0;
            raw[off+1] = 0;
            raw[off+2] = 0;
            raw[off+3] = 0;
        }
    }
}

function crc32(buf) {
    let c;
    let table = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c;
    }
    c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, 'ascii');
    const crcInput = Buffer.concat([typeB, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcInput));
    return Buffer.concat([len, typeB, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const compressed = zlib.deflateSync(raw);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
]);

fs.writeFileSync('assets/logo.png', png);
console.log('Created assets/logo.png (' + png.length + ' bytes)');
