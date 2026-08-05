/**
 * Generate monochrome UI icon PNGs for React Native tintColor.
 * Run: node scripts/generate-ui-icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../assets/icons');
const size = 48;
const stroke = '#243B53';

/** @type {Record<string, string>} */
const icons = {
  calculator: `
    <rect x="10" y="6" width="28" height="36" rx="4" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <line x1="16" y1="14" x2="32" y2="14" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="24" r="2.2" fill="${stroke}"/>
    <circle cx="24" cy="24" r="2.2" fill="${stroke}"/>
    <circle cx="32" cy="24" r="2.2" fill="${stroke}"/>
    <circle cx="16" cy="32" r="2.2" fill="${stroke}"/>
    <circle cx="24" cy="32" r="2.2" fill="${stroke}"/>
    <circle cx="32" cy="32" r="2.2" fill="${stroke}"/>
  `,
  'file-text': `
    <path d="M14 8h14l8 8v24a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M28 8v8h8" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
    <line x1="18" y1="26" x2="30" y2="26" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="18" y1="32" x2="30" y2="32" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="18" y1="38" x2="26" y2="38" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
  `,
  briefcase: `
    <rect x="8" y="18" width="32" height="20" rx="3" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <path d="M16 18v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="8" y1="26" x2="40" y2="26" stroke="${stroke}" stroke-width="2.4"/>
  `,
  settings: `
    <path d="M19.5 9.2l1.1 4.2a11 11 0 0 1 6.8 0l1.1-4.2 3.8 1.6-1.1 4.2a11 11 0 0 1 4.8 4.8l4.2-1.1 1.6 3.8-4.2 1.1a11 11 0 0 1 0 6.8l4.2 1.1-1.6 3.8-4.2-1.1a11 11 0 0 1-4.8 4.8l1.1 4.2-3.8 1.6-1.1-4.2a11 11 0 0 1-6.8 0l-1.1 4.2-3.8-1.6 1.1-4.2a11 11 0 0 1-4.8-4.8l-4.2 1.1-1.6-3.8 4.2-1.1a11 11 0 0 1 0-6.8l-4.2-1.1 1.6-3.8 4.2 1.1a11 11 0 0 1 4.8-4.8l-1.1-4.2 3.8-1.6z" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="5" fill="none" stroke="${stroke}" stroke-width="2.4"/>
  `,
  baby: `
    <circle cx="24" cy="16" r="6" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <path d="M12 36c2-8 8-12 12-12s10 4 12 12" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M18 22c1.5 2 3 3 6 3s4.5-1 6-3" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
  `,
  'heart-pulse': `
    <path d="M24 34s-10-6.5-10-13a5.5 5.5 0 0 1 9.4-3.9A5.5 5.5 0 0 1 34 21c0 6.5-10 13-10 13z" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
    <polyline points="12,24 16,24 18,18 22,30 24,22 28,22" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  landmark: `
    <path d="M24 8l14 28H10L24 8z" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/>
    <line x1="14" y1="36" x2="34" y2="36" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="20" y1="28" x2="28" y2="28" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="22" y1="22" x2="26" y2="22" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
  `,
  coins: `
    <ellipse cx="18" cy="20" rx="8" ry="4" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <path d="M10 20v8c0 2.2 3.6 4 8 4s8-1.8 8-4v-8" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <ellipse cx="30" cy="16" rx="8" ry="4" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <path d="M22 16v8c0 2.2 3.6 4 8 4s8-1.8 8-4v-8" fill="none" stroke="${stroke}" stroke-width="2.4"/>
  `,
  'circle-dollar': `
    <circle cx="24" cy="24" r="14" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <path d="M24 16v16M20.5 18.5c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3-1.6 3-3.5 3-3.5 1.2-3.5 3 1.6 3 3.5 3 3.5-1.2 3.5-3" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
  `,
  info: `
    <circle cx="24" cy="24" r="14" fill="none" stroke="${stroke}" stroke-width="2.4"/>
    <line x1="24" y1="22" x2="24" y2="32" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="24" cy="16.5" r="1.8" fill="${stroke}"/>
  `,
  'chevron-right': `
    <polyline points="18,12 30,24 18,36" fill="none" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  'chevron-down': `
    <polyline points="12,18 24,30 36,18" fill="none" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  'chevron-up': `
    <polyline points="12,30 24,18 36,30" fill="none" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  bullet: `<circle cx="24" cy="24" r="5" fill="${stroke}"/>`,
};

fs.mkdirSync(outDir, { recursive: true });

for (const [name, body] of Object.entries(icons)) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
${body}
</svg>`;
  const outPath = path.join(outDir, `${name}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('wrote', outPath);
}
