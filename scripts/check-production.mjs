import { readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const expectedDomain = 'theagefinder.online';
const oldDomain = 'theagefinder' + '.pages.dev';
const requiredFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  '_redirects',
  '_headers',
];
const skippedDirs = new Set(['.git', 'node_modules', 'dist', 'build']);
const checkedExtensions = new Set([
  '.html',
  '.xml',
  '.txt',
  '.md',
  '.js',
  '.json',
  '.toml',
  '.css',
]);

function extensionFor(file) {
  const match = file.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    if (skippedDirs.has(entry)) continue;

    const fullPath = resolve(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (checkedExtensions.has(extensionFor(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

const failures = [];

for (const file of requiredFiles) {
  try {
    statSync(resolve(root, file));
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

for (const file of walk(root)) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');

  if (content.includes(oldDomain)) {
    failures.push(`Old domain remains in ${rel}`);
  }
}

const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
if (!robots.includes(`https://${expectedDomain}/sitemap.xml`)) {
  failures.push('robots.txt does not point to the production sitemap URL');
}

const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
if (!sitemap.includes(`https://${expectedDomain}/`)) {
  failures.push('sitemap.xml does not contain the production domain');
}

for (const file of walk(root).filter((item) => item.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    failures.push(`${relative(root, file)} has a JavaScript syntax error:\n${result.stderr.trim()}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Production checks passed for https://${expectedDomain}`);
