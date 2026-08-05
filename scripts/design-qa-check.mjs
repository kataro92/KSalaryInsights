/**
 * Lightweight Design QA gate. Flat Design / token hygiene.
 * Run: npm run qa:design
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const ALLOW_HEX = new Set([
 path.normalize('theme/tokens.ts'),
]);

const SHADOW_RE = /\b(shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation)\s*:/;
const HEX_RE = /#[0-9A-Fa-f]{3,8}\b/g;

const findings = [];

function walk(dir) {
 for (const name of fs.readdirSync(dir)) {
 const full = path.join(dir, name);
 const st = fs.statSync(full);
 if (st.isDirectory()) {
 if (name === '__tests__') continue;
 walk(full);
 continue;
 }
 if (!/\.(tsx|ts)$/.test(name)) continue;
 const rel = path.relative(ROOT, full).replace(/\\/g, '/');
 const text = fs.readFileSync(full, 'utf8');
 const lines = text.split(/\r?\n/);
 lines.forEach((line, i) => {
 const trimmed = line.trim();
 if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
 if (SHADOW_RE.test(line)) {
 findings.push({ rel, line: i + 1, kind: 'shadow', text: trimmed.slice(0, 120) });
 }
 if (!ALLOW_HEX.has(path.normalize(rel)) && HEX_RE.test(line)) {
 // Ignore rgba( documentation and template comments already skipped
 if (/rgba?\(/.test(line) && !HEX_RE.test(line.replace(/rgba?\([^)]*\)/g, ''))) return;
 const hexes = line.match(HEX_RE) || [];
 for (const h of hexes) {
 findings.push({ rel, line: i + 1, kind: 'hex', text: `${h} · ${trimmed.slice(0, 100)}` });
 }
 }
 });
 }
}

walk(ROOT);

if (findings.length === 0) {
 console.log('Design QA check PASSED. no shadow/elevation or off-token hex in src/.');
 process.exit(0);
}

console.error('Design QA check FAILED:\n');
for (const f of findings) {
 console.error(`- [${f.kind}] ${f.rel}:${f.line} ${f.text}`);
}
process.exit(1);
