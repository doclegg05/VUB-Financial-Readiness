// Zero-dependency .env loader for the narration generators.
//
// Imported for its side effect (`import './load-env.mjs';`) at the top of each
// generate-*.mjs. Loads KEY=VALUE lines from a `.env` file — checked in this
// folder first, then the repo root — into process.env. Values already present in
// the environment are NEVER overwritten, so a configured env-var/secret (local
// shell or the web environment's secret config) always wins over the file.
//
// `.env` is git-ignored; `.env.example` documents the expected variables.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const candidates = [join(here, '.env'), join(here, '..', '..', '.env')];

for (const file of candidates) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // no .env at this location — fine
  }
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
}
