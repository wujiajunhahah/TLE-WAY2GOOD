import { createHash } from 'node:crypto';
import { put, head } from '@vercel/blob';

const allowedOrigins = new Set((process.env.SIGNUP_ALLOWED_ORIGINS || 'https://wujiajunhahah.github.io').split(',').map(s => s.trim()).filter(Boolean));
const attempts = new Map();
const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

export function validateSignup(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || body.website || body.consent !== true) return null;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\u0000-\u001f\u007f]/.test(email)) return null;
  return { email, language: body.language === 'en' ? 'en' : 'zh' };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (!allowedOrigins.has(origin)) return send(res, 403, { ok: false });
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return send(res, 405, { ok: false });
  }
  if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') return send(res, 415, { ok: false });
  // This is a per-instance burst limit. A shared limiter is needed at higher traffic.
  const now = Date.now();
  for (const [key, history] of attempts) if (history.every(t => now - t >= 60000)) attempts.delete(key);
  const key = req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const history = (attempts.get(key) || []).filter(t => now - t < 60000);
  if (history.length >= 8) {
    res.setHeader('Retry-After', '60');
    return send(res, 429, { ok: false });
  }
  attempts.set(key, [...history, now]);
  try {
    let body = req.body;
    if (body === undefined) {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 4096) return send(res, 413, { ok: false });
      }
      try { body = JSON.parse(raw); } catch { return send(res, 400, { ok: false }); }
    } else {
      if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body)) > 4096) return send(res, 413, { ok: false });
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { return send(res, 400, { ok: false }); }
      }
    }
    const signup = validateSignup(body);
    if (!signup) return send(res, 400, { ok: false });
    const id = createHash('sha256').update(signup.email).digest('hex');
    const pathname = `subscribers/${id}.json`;
    const record = { ...signup, createdAt: new Date().toISOString(), consentVersion: '2026-10-07', source: 'way2good-landing' };
    try {
      await put(pathname, JSON.stringify(record), {
        access: 'private', addRandomSuffix: false, allowOverwrite: false,
        contentType: 'application/json', abortSignal: AbortSignal.timeout(10000)
      });
    } catch (error) {
      // Retries cannot create duplicate records or disclose whether another visitor signed up.
      try { await head(pathname, { abortSignal: AbortSignal.timeout(3000) }); }
      catch { throw error; }
    }
    return send(res, 200, { ok: true });
  } catch {
    // Do not put submitted emails or storage credentials in logs or responses.
    return send(res, 503, { ok: false });
  }
}
