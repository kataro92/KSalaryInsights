import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = pathToFileURL(rootDir + path.sep).href;

function resolveFile(url) {
  const tryUrls = [];
  if (/\.(ts|tsx|json|mjs|js)$/.test(url)) tryUrls.push(url);
  else {
    for (const ext of ['.ts', '.tsx', '.json', '.js']) tryUrls.push(url + ext);
    tryUrls.push(url + '/index.ts');
  }
  for (const candidate of tryUrls) {
    try {
      const fp = fileURLToPath(candidate);
      if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const absolute = new URL(specifier.slice(2), root).href;
    const found = resolveFile(absolute);
    if (!found) throw new Error(`Cannot resolve alias ${specifier} -> ${absolute}`);
    return { shortCircuit: true, url: found };
  }

  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL) {
    const absolute = new URL(specifier, context.parentURL).href;
    const found = resolveFile(absolute);
    if (found) return { shortCircuit: true, url: found };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    const source = fs.readFileSync(fileURLToPath(url), 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${source};`,
    };
  }
  return nextLoad(url, context);
}
