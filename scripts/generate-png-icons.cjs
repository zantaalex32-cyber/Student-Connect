const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, drawFn) {
  const buffer = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    buffer[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[offset++] = r;
      buffer[offset++] = g;
      buffer[offset++] = b;
      buffer[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(buffer);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function studentLogoDraw(x, y, w, h) {
  // Center coordinates normalized -1 to 1
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx); // -pi to pi

  // Background is crisp clean white
  let r = 255, g = 255, b = 255, a = 255;

  // Outer circle mask for rounded corners or squircle
  if (dist > 0.95) {
    return [255, 255, 255, 0];
  }

  // Inner vibrant Green 'C'
  if (dist >= 0.22 && dist <= 0.45) {
    // Opening is between -0.4 and 0.4 rad (right side)
    if (angle < -0.3 || angle > 0.3) {
      r = 16; g = 185; b = 129; // #10B981 emerald
      return [r, g, b, 255];
    }
  }

  // Blue / cyan arc
  if (dist >= 0.45 && dist <= 0.62) {
    if (angle > -2.2 && angle < 0.2) {
      r = 2; g = 132; b = 199; // #0284C7 sky blue
      return [r, g, b, 255];
    }
  }

  // Magenta / rose arc
  if (dist >= 0.48 && dist <= 0.72) {
    if (angle > 1.2 && angle < 2.9) {
      r = 225; g = 29; b = 72; // #E11D48 rose/magenta
      return [r, g, b, 255];
    }
  }

  // Amber / yellow arc at top
  if (dist >= 0.60 && dist <= 0.82) {
    if (angle > -1.8 && angle < -0.2) {
      r = 245; g = 158; b = 11; // #F59E0B amber
      return [r, g, b, 255];
    }
  }

  // Floating dots and confetti:
  // Top yellow dot
  const dot1Dist = Math.hypot(dx - 0.22, dy + 0.75);
  if (dot1Dist < 0.07) return [234, 179, 8, 255];

  // Right green dot
  const dot2Dist = Math.hypot(dx - 0.7, dy - 0.1);
  if (dot2Dist < 0.08) return [34, 197, 94, 255];

  // Bottom left green dot
  const dot3Dist = Math.hypot(dx + 0.6, dy - 0.55);
  if (dot3Dist < 0.08) return [34, 197, 94, 255];

  // Right pink dot
  const dot4Dist = Math.hypot(dx - 0.75, dy - 0.35);
  if (dot4Dist < 0.06) return [244, 63, 94, 255];

  return [r, g, b, a];
}

const pubDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), createPNG(192, 192, studentLogoDraw));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), createPNG(512, 512, studentLogoDraw));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPNG(180, 180, studentLogoDraw));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, studentLogoDraw));

console.log('Successfully generated PWA and Apple Touch PNG icons!');
