#!/usr/bin/env node

/* eslint-env node */

/**
 * Prelaunch smoke checks for Vercel frontend + AWS backend.
 *
 * Usage:
 *   node ./scripts/prelaunch-smoke-check.mjs --frontend https://your-frontend.vercel.app --backend https://api.yourdomain.com
 */

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node ./scripts/prelaunch-smoke-check.mjs --frontend <url> --backend <url>');
  process.exit(0);
}

function getArg(name) {
  const idx = args.indexOf(name);
  if (idx === -1) return '';
  return args[idx + 1] || '';
}

const frontendRaw = getArg('--frontend') || process.env.FRONTEND_URL || '';
const backendRaw = getArg('--backend') || process.env.BACKEND_URL || '';

if (!frontendRaw || !backendRaw) {
  console.error('Missing required URLs.');
  console.error('Provide --frontend and --backend, or FRONTEND_URL and BACKEND_URL env vars.');
  process.exit(1);
}

function normalizeBase(url) {
  return url.trim().replace(/\/+$/, '');
}

function toApiBase(url) {
  const base = normalizeBase(url);
  if (/\/api\/v1$/i.test(base)) return base;
  if (/\/api$/i.test(base)) return `${base}/v1`;
  return `${base}/api/v1`;
}

const frontend = normalizeBase(frontendRaw);
const backend = normalizeBase(backendRaw);
const apiBase = toApiBase(backend);

const checks = [];

function addCheck(name, fn) {
  checks.push({ name, fn });
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 10000) {
  const controller = new globalThis.AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await globalThis.fetch(url, { ...init, signal: controller.signal });
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

function expectOkStatus(status) {
  return status >= 200 && status < 400;
}

addCheck('Frontend root reachable', async () => {
  const res = await fetchWithTimeout(`${frontend}/`);
  if (!expectOkStatus(res.status)) {
    throw new Error(`Expected 2xx/3xx from frontend root, got ${res.status}`);
  }
});

addCheck('Frontend SPA route /contact reachable', async () => {
  const res = await fetchWithTimeout(`${frontend}/contact`);
  if (!expectOkStatus(res.status)) {
    throw new Error(`Expected 2xx/3xx from /contact, got ${res.status}`);
  }
});

addCheck('Frontend SPA route /donations reachable', async () => {
  const res = await fetchWithTimeout(`${frontend}/donations`);
  if (!expectOkStatus(res.status)) {
    throw new Error(`Expected 2xx/3xx from /donations, got ${res.status}`);
  }
});

addCheck('Frontend security headers present', async () => {
  const res = await fetchWithTimeout(`${frontend}/`);
  const csp = res.headers.get('content-security-policy');
  const frame = res.headers.get('x-frame-options');
  const ctype = res.headers.get('x-content-type-options');

  if (!csp) throw new Error('Missing Content-Security-Policy header');
  if (!frame) throw new Error('Missing X-Frame-Options header');
  if (!ctype) throw new Error('Missing X-Content-Type-Options header');
});

addCheck('Backend API health endpoint reachable', async () => {
  const res = await fetchWithTimeout(`${apiBase}/health/`);
  if (!expectOkStatus(res.status)) {
    throw new Error(`Expected 2xx/3xx from ${apiBase}/health/, got ${res.status}`);
  }
});

addCheck('Backend organization endpoint reachable', async () => {
  const res = await fetchWithTimeout(`${apiBase}/organization/`);
  if (!expectOkStatus(res.status)) {
    throw new Error(`Expected 2xx/3xx from ${apiBase}/organization/, got ${res.status}`);
  }
});

addCheck('Backend CORS preflight allows frontend origin with credentials', async () => {
  const res = await fetchWithTimeout(`${apiBase}/contacts/`, {
    method: 'OPTIONS',
    headers: {
      Origin: frontend,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });

  if (!expectOkStatus(res.status)) {
    throw new Error(`CORS preflight failed with status ${res.status}`);
  }

  const acao = (res.headers.get('access-control-allow-origin') || '').trim();
  const acac = (res.headers.get('access-control-allow-credentials') || '').trim().toLowerCase();

  if (acao !== frontend) {
    throw new Error(`access-control-allow-origin must match frontend (${frontend}), got '${acao || 'missing'}'`);
  }

  if (acac !== 'true') {
    throw new Error(`access-control-allow-credentials must be true, got '${acac || 'missing'}'`);
  }
});

console.log('Prelaunch smoke check target');
console.log(`- Frontend: ${frontend}`);
console.log(`- Backend:  ${backend}`);
console.log(`- API base: ${apiBase}`);
console.log('');

let failures = 0;

for (const [index, check] of checks.entries()) {
  const prefix = `${index + 1}.`;
  try {
    await check.fn();
    console.log(`${prefix} PASS  ${check.name}`);
  } catch (error) {
    failures += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${prefix} FAIL  ${check.name}`);
    console.error(`   ${message}`);
  }
}

console.log('');

if (failures > 0) {
  console.error(`Prelaunch smoke check failed (${failures} check${failures === 1 ? '' : 's'}).`);
  process.exit(1);
}

console.log('Prelaunch smoke check passed. Ready for launch verification.');
