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
  sans400: font('pc-sans-400.woff2'),
  sans700: font('pc-sans-700.woff2'),
  latin400: font('pc-latin-400.woff2'),
};

const html = (locale) => {
  const t = content[locale];
  return `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8">
<style>
@font-face{font-family:'PC Serif';src:url(${FONTS.serif}) format('woff2');font-weight:200 900}
@font-face{font-family:'PC Sans';src:url(${FONTS.sans400}) format('woff2');font-weight:400}
@font-face{font-family:'PC Sans';src:url(${FONTS.sans700}) format('woff2');font-weight:500 800}
@font-face{font-family:'PC Latin';src:url(${FONTS.latin400}) format('woff2');font-weight:400}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#123A35;color:#F7F4EE;font:17px/1.7 'PC Latin','PC Sans',sans-serif;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;justify-content:space-between;align-items:baseline}
.brand{font-family:'PC Serif';font-size:30px;font-weight:600}
.brand small{display:block;font-family:'PC Latin','PC Sans';font-size:14px;font-weight:400;color:#C6CFC9;margin-top:6px;letter-spacing:.04em}
.eyebrow{font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:14px;letter-spacing:.14em;color:#E8A08D}
h1{font-family:'PC Serif';font-size:76px;font-weight:600;line-height:1.16;letter-spacing:-.01em}
h1 em{font-style:normal;color:#E8A08D}
.rule{height:1px;background:rgba(247,244,238,.24);margin:28px 0 22px}
.foot{display:flex;justify-content:space-between;align-items:baseline;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:13px;color:#C6CFC9}
</style></head><body>
<div class="top">
  <div class="brand">Pet Companionship<small>${t.brandLine} · ${t.brandNote}</small></div>
  <div class="eyebrow">${t.eyebrow}</div>
</div>
<div>
  <h1>${t.h1}</h1>
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
