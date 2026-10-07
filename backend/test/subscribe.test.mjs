import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { validateSignup } from '../api/subscribe.mjs';

test('consent and honeypot protect the email collection boundary', () => {
  const body = { email: '  Owner@Example.com ', consent: true, language: 'en' };
  assert.deepEqual(validateSignup(body), { email: 'owner@example.com', language: 'en' });
  for (const invalid of [null, [], {}, { ...body, consent: false }, { ...body, website: 'spam' }, { ...body, email: 'invalid' }, { ...body, email: 'a\u0000@example.com' }]) {
    assert.equal(validateSignup(invalid), null);
  }
});

async function call(req) {
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; }, end: (body) => { res.body = body; } };
  await handler(req, res);
  return { status: res.statusCode, headers, body: res.body };
}

test('reject untrusted origins and do not reflect arbitrary CORS origins', async () => {
  const result = await call({ method: 'POST', headers: { origin: 'https://other.example' } });
  assert.equal(result.status, 403);
  assert.equal(result.headers['Access-Control-Allow-Origin'], undefined);
});

test('Pages can preflight JSON signup and errors retain CORS and no-store headers', async () => {
  const headers = { origin: 'https://wujiajunhahah.github.io', 'content-type': 'application/json' };
  const preflight = await call({ method: 'OPTIONS', headers });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers['Access-Control-Allow-Origin'], headers.origin);
  const invalid = await call({ method: 'POST', headers, body: { email: 'invalid', consent: true } });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.headers['Cache-Control'], 'no-store');
});

test('method, content type and oversized input are rejected before storage', async () => {
  const headers = { origin: 'https://wujiajunhahah.github.io', 'content-type': 'application/json' };
  assert.equal((await call({ method: 'GET', headers })).status, 405);
  assert.equal((await call({ method: 'POST', headers: { ...headers, 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await call({ method: 'POST', headers, body: 'x'.repeat(4097) })).status, 413);
});

test('repeated attempts return a retry delay without reaching storage', async () => {
  const headers = { origin: 'https://wujiajunhahah.github.io', 'content-type': 'application/json', 'x-real-ip': 'synthetic-test-client' };
  for (let i = 0; i < 8; i++) {
    assert.equal((await call({ method: 'POST', headers, body: {} })).status, 400);
  }
  const limited = await call({ method: 'POST', headers, body: {} });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers['Retry-After'], '60');
});
