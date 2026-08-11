import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'fedramp-20x-field-guide.html');
const outputPath = resolve(root, 'src/data/source-data.json');

function extractData(source) {
  const marker = 'const DATA = ';
  const start = source.indexOf(marker);
  if (start === -1) throw new Error('Could not locate the embedded DATA object.');

  let depth = 0;
  let inString = false;
  let escaped = false;
  const objectStart = start + marker.length;

  for (let index = objectStart; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(objectStart, index + 1));
    }
  }

  throw new Error('The embedded DATA object was not closed.');
}

const source = await readFile(sourcePath, 'utf8');
const data = extractData(source);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(
  `Extracted ${data.rulesets.length} rulesets, ${data.glossary.length} terms, and ${data.ksi.reduce((sum, family) => sum + family.indicators.length, 0)} KSI indicators.`,
);
