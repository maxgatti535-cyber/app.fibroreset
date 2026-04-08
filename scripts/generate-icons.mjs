/**
 * Generates icon-192.png and icon-512.png for the PWA
 * using only Node.js built-ins (writes a minimal PNG manually).
 * The icon is a gradient sphere (mint → lavender) with a cream wave,
 * matching the Equilibria Reset brand.
 */

import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = join(__dirname, '..', 'public');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.40;

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Gradient background mint → lavender
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, '#7EC8C0');
  grad.addColorStop(1, '#9B7ECB');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Cream wave
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - r * 0.05);
  ctx.bezierCurveTo(cx - r * 0.4, cy - r * 0.28, cx + r * 0.15, cy + r * 0.22, cx + r, cy - r * 0.05);
  ctx.lineTo(cx + r, cy + r * 0.18);
  ctx.bezierCurveTo(cx + r * 0.15, cy + r * 0.42, cx - r * 0.4, cy - r * 0.05, cx - r, cy + r * 0.18);
  ctx.closePath();

  const waveGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  waveGrad.addColorStop(0, '#F5E2CB');
  waveGrad.addColorStop(1, '#EBD3BC');
  ctx.fillStyle = waveGrad;
  ctx.fill();

  ctx.restore();

  return canvas.toBuffer('image/png');
}

for (const size of [192, 512]) {
  const buf = drawIcon(size);
  const out = join(outDir, `icon-${size}.png`);
  writeFileSync(out, buf);
  console.log(`✅ Written: icon-${size}.png`);
}
