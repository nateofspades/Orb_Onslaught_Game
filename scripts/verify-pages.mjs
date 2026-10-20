// Read-only deployment verification. Run from the repository: node scripts/verify-pages.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const command = (program, args) => execFileSync(program, args, { cwd: root, encoding: 'utf8' }).trim();
const api = route => JSON.parse(command('gh', ['api', route]));
const repository = 'nateofspades/Orb_Onslaught_Game';
const live = 'https://nateofspades.github.io/Orb_Onslaught_Game/';
const expected = command('git', ['rev-parse', 'HEAD']);
const remote = command('git', ['ls-remote', 'origin', 'refs/heads/main']).split(/\s+/)[0];
assert.equal(remote, expected, 'origin/main is not the local HEAD');
const commit = api(`repos/${repository}/commits/${expected}`);
assert.equal(commit.sha, expected);
assert.equal(commit.author?.login, 'nateofspades', 'GitHub author attribution differs');
assert.equal(commit.commit.author.name, 'Nathan Burns');
assert.equal(commit.commit.author.email, '33226599+nateofspades@users.noreply.github.com');
const pages = api(`repos/${repository}/pages`);
assert.equal(pages.source?.branch, 'main', 'Pages source branch differs');
assert.equal(pages.source?.path, '/', 'Pages source directory differs');
const build = api(`repos/${repository}/pages/builds/latest`);
assert.equal(build.status, 'built', 'Latest Pages build is not successful yet');
assert.equal(build.commit, expected, 'Latest Pages build does not contain HEAD yet');

const pending = ['index.html'];
const verified = [];
const seen = new Set();
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
while (pending.length) {
  const relative = pending.shift();
  if (seen.has(relative)) continue;
  seen.add(relative);
  assert.ok(!relative.startsWith('../') && !path.isAbsolute(relative), `Asset outside repository: ${relative}`);
  const localBytes = readFileSync(path.join(root, relative));
  const url = new URL(relative, live);
  url.searchParams.set('verify', expected);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Live ${relative} returned HTTP ${response.status}`);
  const remoteBytes = Buffer.from(await response.arrayBuffer());
  assert.equal(digest(remoteBytes), digest(localBytes), `Live ${relative} differs from repository HEAD`);
  verified.push({ file: relative, bytes: localBytes.length, sha256: digest(localBytes) });
  const text = localBytes.toString('utf8');
  const references = [];
  if (relative.endsWith('.html')) {
    for (const match of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) references.push(match[1]);
  }
  if (/\.(?:m?js)$/.test(relative)) {
    for (const match of text.matchAll(/\b(?:from\s*|import\s*\(\s*|import\s*)["']([^"']+)["']/g)) references.push(match[1]);
  }
  if (relative.endsWith('.css')) {
    for (const match of text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) references.push(match[1]);
  }
  for (const reference of references) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(reference)) continue;
    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;
    pending.push(path.posix.normalize(path.posix.join(path.posix.dirname(relative), clean)));
  }
}
console.log(JSON.stringify({ repository, expected, remote, author: commit.author.login, source: pages.source, pagesBuild: { status: build.status, commit: build.commit, updatedAt: build.updated_at }, live, verified }, null, 2));
