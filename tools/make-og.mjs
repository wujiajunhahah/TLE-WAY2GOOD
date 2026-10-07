// Generates public/og.jpg — the link-preview card.
// Asset-free by design: it is typeset with the same self-hosted font as the page, so the share
// card matches the text-only build. Dev-only script; needs Playwright available.
//   PLAYWRIGHT=/path/to/playwright node tools/make-og.mjs
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { content } from '../content.mjs';

const req = createRequire(import.meta.url);
const CANDIDATES = [
  process.env.PLAYWRIGHT,
  '/Users/wujiajun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
  'playwright',
].filter(Boolean);
const mod = CANDIDATES.find((p) => { try { req.resolve(p); return true; } catch { return false; } });
if (!mod) { console.error('Playwright not found; set PLAYWRIGHT=/path/to/playwright'); process.exit(1); }
const { chromium } = req(mod);

// Fonts are inlined as data URLs: a page built with setContent() has an opaque origin, so a
// cross-origin <link>/@font-face fetch is blocked by CORS and silently falls back. Inlining
// keeps this script self-contained (no running server needed) and guarantees the card is
// typeset in the same face as the page.
const font = (file) => `data:font/woff2;base64,${readFileSync(`public/fonts/${file}`).toString('base64')}`;
const FONTS = {
  serif: font('pc-serif.woff2'),
  sans: font('pc-sans.woff2'),
  latin: font('pc-latin.woff2'),
  mono: font('pc-mono.woff2'),
};

const html = (locale) => {
  const t = content[locale];
  return `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8">
<style>
@font-face{font-family:'PC Serif';src:url(${FONTS.serif}) format('woff2');font-weight:200 900}
@font-face{font-family:'PC Sans';src:url(${FONTS.sans}) format('woff2');font-weight:100 900}
@font-face{font-family:'PC Latin';src:url(${FONTS.latin}) format('woff2');font-weight:100 900}
@font-face{font-family:'PC Mono';src:url(${FONTS.mono}) format('woff2');font-weight:100 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#2A1C12;color:#F5F1E8;font:17px/1.7 'PC Latin','PC Sans',sans-serif;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;justify-content:space-between;align-items:baseline}
.brand{display:flex;align-items:center;gap:17px}
.brand svg{width:50px;height:50px;flex:none;display:block}
.brand .bt{font-family:'PC Serif';font-size:30px;font-weight:600}
.brand small{display:block;font-family:'PC Latin','PC Sans';font-size:14px;font-weight:400;color:#E0D3C4;margin-top:6px;letter-spacing:.04em}
.eyebrow{font-family:'PC Mono','PC Sans',ui-monospace,Menlo,monospace;font-size:14px;letter-spacing:.14em;color:#F2B264}
h1{font-family:'PC Serif';font-size:76px;font-weight:600;line-height:1.16;letter-spacing:-.01em}
h1 em{font-style:normal;color:#F2B264}
.rule{height:1px;background:rgba(245,241,232,.24);margin:28px 0 22px}
.foot{display:flex;justify-content:space-between;align-items:baseline;font-family:'PC Mono','PC Sans',ui-monospace,Menlo,monospace;font-size:13px;color:#E0D3C4}
</style></head><body>
<div class="top">
  <div class="brand">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M15.5 46.5 C16.8 39.5 19.4 34.6 22.2 31.6 L25.2 23.4 L30.6 30.9 C31.3 30.6 32.7 30.6 33.4 30.9 L38.8 23.4 L41.8 31.6 C44.6 34.6 47.2 39.5 48.5 46.5" fill="none" stroke="#F5F1E8" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 52 L59 52" fill="none" stroke="#E8912F" stroke-width="5" stroke-linecap="round"/>
    </svg>
    <span class="bt">way2good<small>${t.brandLine} · ${t.brandNote}</small></span></div>
  <div class="eyebrow">${t.eyebrow}</div>
</div>
<div>
  <h1>${t.h1}</h1>
  <svg viewBox="0 0 1000 90" width="1000" height="90" aria-hidden="true" style="display:block;margin:8px 0 18px">
    <path d="M 0 62 C 180 62 240 14 420 14 C 600 14 660 62 840 62 C 900 62 950 52 1000 34" fill="none" stroke="#F2B264" stroke-width="2"/>
    <circle cx="0" cy="62" r="7" fill="#F2B264"/>
  </svg>
  <div class="rule"></div>
  <div class="foot"><span>${t.stage}</span><span>wujiajunhahah.github.io/TLE-WAY2GOOD</span></div>
</div>
</body></html>`;
};

const browser = await chromium.launch({ headless: true });
mkdirSync('public', { recursive: true });
for (const locale of ['zh', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html(locale), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const used = await page.evaluate(async () => {
    await document.fonts.ready;
    return { serif: document.fonts.check('600 76px "PC Serif"'), sans: document.fonts.check('400 17px "PC Sans"') };
  });
  if (!used.serif) { console.error('serif did not load into the card'); process.exit(1); }
  await page.waitForTimeout(300);
  const out = `public/og-${locale}.jpg`;
  await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
  console.log('wrote', out);
  await page.close();
}
await browser.close();
console.log('done');
