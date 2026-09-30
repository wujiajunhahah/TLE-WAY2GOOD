// Renders public/{zh,en}/index.html from content.mjs.
// Identity: a printed research brief. A sticky left rail carries each section's number and
// label; hairline rules divide sections. The two-way thesis is carried structurally
// (the five-moment timeline, paired columns, arrow chains) and semantically by colour
// (owner / today = deep green, pet / opportunity = clay).
// Layout variety is deliberate: hero, fact band, timeline, evidence + table, full-bleed photo,
// dark pivot band, principle grid, numbered rows, form panel. Nothing repeats seven times.
// Run: node build.mjs
import { writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { content, sourceLinks } from './content.mjs';

// Usage:
//   node build.mjs                                     -> server build into public/ (placeholders kept)
//   node build.mjs --static --base=/REPO/ --origin=https://user.github.io/REPO --out=docs
// Static mode substitutes the origin, prefixes internal links with the base path, and writes
// a root redirect, robots.txt, sitemap.xml and .nojekyll so a project GitHub Pages site works.
const argv = {};
for (const a of process.argv.slice(2)) {
  const [k, ...rest] = a.replace(/^--/, '').split('=');
  argv[k] = rest.length ? rest.join('=') : true;   // bare flags must not be dropped
}
const BASE = argv.base ? ('/' + argv.base.replace(/^\/+|\/+$/g, '') + '/') : '/';
const ORIGIN = argv.origin || '__SITE_ORIGIN__';
const OUT = argv.out || 'public';
const STATIC = Boolean(argv.static);
// --images=all (default) | minimal (hero + full-bleed only) | none (typographic variant)
const IMGS = argv.images || (argv['no-images'] ? 'none' : 'all');
const NOIMG = IMGS === 'none';
const MINIMAL = IMGS === 'minimal';
const withBase = (s) => (BASE === '/' ? s : s.replace(/(href|src)="\//g, (m, attr) => `${attr}="${BASE}`));
// ORIGIN is the full public base (it may already contain the repo path), so absolute URLs are
// built from SITE — never ORIGIN + BASE, which would repeat the sub-path.
const SITE = ORIGIN === '__SITE_ORIGIN__' ? ORIGIN + '/' : ORIGIN.replace(/\/+$/, '') + '/';

const rail = (label, dark = false) => {
  const [num, text] = label.split(' / ');
  return `<p class="rail${dark ? ' rail-dk' : ''}"><span class="rail-num">${num}</span><span class="rail-text">${text}</span></p>`;
};
const chain = (nodes, arrow) =>
  nodes.map((x, i) => `<span class="node">${x}</span>${i < nodes.length - 1 ? `<span class="arrow" aria-hidden="true">${arrow}</span>` : ''}`).join('');

const html = (c) => {
  const other = c.lang === 'en' ? 'zh' : 'en';
  const otherLang = c.lang === 'en' ? 'zh-CN' : 'en';
  const me = c.lang === 'en' ? 'en' : 'zh';
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${c.desc}">
<meta name="robots" content="__ROBOTS__">
<meta name="theme-color" content="#123A35">
<link rel="canonical" href="__SITE_ORIGIN__/${me}/">
<link rel="alternate" hreflang="zh-CN" href="__SITE_ORIGIN__/zh/">
<link rel="alternate" hreflang="en" href="__SITE_ORIGIN__/en/">
<link rel="alternate" hreflang="x-default" href="__SITE_ORIGIN__/zh/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pet Companionship">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.desc}">
<meta property="og:url" content="__SITE_ORIGIN__/${me}/">
<meta property="og:image" content="__SITE_ORIGIN__/og-${me}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${c.ogLocaleAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${c.desc}">
<meta name="twitter:image" content="__SITE_ORIGIN__/og-${me}.jpg">
<meta name="pc-base" content="${BASE}">
<meta name="pc-mode" content="${STATIC ? 'static' : 'server'}">
<link rel="preload" href="/fonts/pc-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/pc-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<script src="/app.js" defer></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': '__SITE_ORIGIN__/#website', url: '__SITE_ORIGIN__/', name: 'Pet Companionship', inLanguage: ['zh-CN', 'en'] },
      { '@type': 'WebPage', '@id': `__SITE_ORIGIN__/${me}/#webpage`, url: `__SITE_ORIGIN__/${me}/`, name: c.title, description: c.desc, inLanguage: c.lang, isPartOf: { '@id': '__SITE_ORIGIN__/#website' } }
    ]
  })}</script>
</head>
<body${NOIMG ? ' class="no-img"' : MINIMAL ? ' class="img-min"' : ''}>
<a class="skip" href="#main">${c.skip}</a>

<header class="top">
  <div class="shell top-in">
    <a class="brand" href="/${me}/">
      <span class="brand-mark" aria-hidden="true">pc.</span>
      <span class="brand-text">Pet Companionship<small>${c.brandLine} · ${c.brandNote}</small></span>
    </a>
    <nav class="nav" aria-label="${c.nav}">
      <a href="#gap">${c.navGap}</a>
      <a href="#turn">${c.navTurn}</a>
      <a href="#users">${c.navUsers}</a>
      <a class="lang" href="/${other}/" lang="${otherLang}" hreflang="${other}" aria-label="${c.langSwitchLabel}">${c.langSwitch}</a>
      <a class="btn btn-sm" href="#subscribe">${c.navCta}</a>
    </nav>
  </div>
</header>

<main id="main">

  <section class="hero">
    <div class="shell hero-in">
      <div class="hero-copy rv">
        <p class="eyebrow">${c.eyebrow}</p>
        <h1>${c.h1}</h1>
        <p class="lede">${c.lede}</p>
        <div class="hero-act">
          <a class="btn" href="#subscribe">${c.ctaPrimary}</a>
          <a class="link-quiet" href="#gap">${c.ctaQuiet}<span aria-hidden="true"> →</span></a>
        </div>
        <p class="hero-stage">${c.stage}</p>
      </div>
      ${NOIMG ? '' : `<figure class="hero-fig rv">
        <img src="/assets/hero.jpg" width="1056" height="922" alt="${c.heroAlt}" fetchpriority="high">
      </figure>`}
    </div>
  </section>

  <section class="facts" aria-label="${c.factsLabel}">
    <div class="shell facts-in">
      ${c.facts.map(f => `<div class="fact">
        <p class="fact-v">${f.value}<span class="fact-u">${f.unit}</span></p>
        <p class="fact-t">${f.text}</p>
      </div>`).join('\n      ')}
    </div>
    <div class="shell"><p class="src">${c.sourceNote}</p></div>
  </section>

  <section id="gap" class="sec">
    <div class="shell sec-in">
      ${rail(c.gapLabel)}
      <div class="body">
        <h2>${c.gapTitle}</h2>
        <p class="intro">${c.gapIntro}</p>
        <ol class="steps">
          ${c.steps.map(s => `<li class="step${s.isBreak ? ' step-break' : ''}">
            <span class="step-n">${s.n}</span>
            <span class="step-t">${s.t}</span>
            <span class="step-d">${s.d}</span>
          </li>`).join('\n          ')}
        </ol>
        <blockquote class="break">
          <p class="break-l">${c.breakLabel}</p>
          <p class="break-t">${c.breakText}</p>
        </blockquote>
      </div>
    </div>
    ${NOIMG ? '' : `<figure class="bleed">
      <img src="/assets/away.jpg" width="810" height="274" alt="${c.awayCaption}">
      <figcaption class="shell">${c.awayCaption}</figcaption>
    </figure>`}
  </section>

  <section class="sec">
    <div class="shell sec-in">
      ${rail(c.marketLabel)}
      <div class="body">
        <h2>${c.marketTitle}</h2>
        <p class="intro">${c.marketIntro}</p>
        <div class="market-mid">
          <div class="pair">
            <div class="pair-col pair-has">
              <h3>${c.hasTitle}</h3>
              <ul>${c.has.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
            <div class="pair-col pair-lacks">
              <h3>${c.lacksTitle}</h3>
              <ul>${c.lacks.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
          </div>
          ${NOIMG || MINIMAL ? '' : `<figure class="devices">
            <img src="/assets/devices.jpg" width="780" height="396" alt="${c.devicesAlt}">
            <figcaption>${c.devicesCaption}</figcaption>
          </figure>`}
        </div>
        <table class="products">
          <caption class="vh">${c.marketLabel}</caption>
          <thead><tr>${c.productsHead.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
          <tbody>
          ${c.products.map(p => `<tr><th scope="row">${p.name}</th><td class="p-form">${p.form}</td><td class="p-gap">${p.gap}</td></tr>`).join('\n          ')}
          </tbody>
        </table>
        <p class="note">${c.productsNote}</p>
      </div>
    </div>
  </section>

  <section id="users" class="sec">
    <div class="shell sec-in">
      ${rail(c.usersLabel)}
      <div class="body">
        <h2>${c.usersTitle}</h2>
        <p class="intro">${c.usersIntro}</p>
        <ul class="users">
          ${c.users.map(u => `<li><span class="u-t">${u.t}</span><span class="u-d">${u.d}</span></li>`).join('\n          ')}
        </ul>
        <div class="trait">
          ${NOIMG || MINIMAL ? '' : '<img src="/assets/hold.jpg" width="466" height="448" alt="" aria-hidden="true">'}
          <p>${c.usersTrait}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="turn" class="band">
    <div class="shell sec-in">
      ${rail(c.turnLabel, true)}
      <div class="body">
        <h2>${c.turnTitle}</h2>
        <figure class="net">
          <figcaption class="net-cap">${c.netLabel}</figcaption>
          <div class="net-row net-now">
            <div class="net-track" aria-hidden="true">
              <svg viewBox="0 0 1000 40" preserveAspectRatio="none">
                <path class="net-line" d="M 8 20 H 992" pathLength="1" vector-effect="non-scaling-stroke"/>
                <path class="net-flow" d="M 8 20 H 992" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot" cx="8" cy="20" r="3.2" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot" cx="500" cy="20" r="2.4" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot" cx="992" cy="20" r="3.2" vector-effect="non-scaling-stroke"/>
                <path class="net-head" d="M 488 14 L 500 20 L 488 26" vector-effect="non-scaling-stroke"/>
              </svg>
            </div>
            <ul class="net-labels">
              <li>${c.currentChain[0]}</li><li>${c.currentChain[1]}</li><li>${c.currentChain[2]}</li>
            </ul>
            <p class="net-sub">${c.currentCap}</p>
          </div>
          <div class="net-row net-next">
            <div class="net-track" aria-hidden="true">
              <svg viewBox="0 0 1000 40" preserveAspectRatio="none">
                <path class="net-line net-line-hi" d="M 8 20 H 992" pathLength="1" vector-effect="non-scaling-stroke"/>
                <path class="net-flow net-flow-hi" d="M 8 20 H 992" vector-effect="non-scaling-stroke"/>
                <path class="net-flow net-flow-hi net-flow-back" d="M 8 20 H 992" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot net-dot-hi" cx="8" cy="20" r="3.2" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot net-dot-hi" cx="500" cy="20" r="2.4" vector-effect="non-scaling-stroke"/>
                <circle class="net-dot net-dot-hi" cx="992" cy="20" r="3.2" vector-effect="non-scaling-stroke"/>
                <path class="net-head net-head-l" d="M 20 14 L 8 20 L 20 26" vector-effect="non-scaling-stroke"/>
                <path class="net-head net-head-r" d="M 980 14 L 992 20 L 980 26" vector-effect="non-scaling-stroke"/>
              </svg>
            </div>
            <ul class="net-labels net-labels-hi">
              <li>${c.nextChain[0]}</li><li>${c.nextChain[1]}</li><li>${c.nextChain[2]}</li>
            </ul>
            <p class="net-sub net-sub-hi">${c.nextCap}</p>
          </div>
        </figure>
        <div class="chains">
          <div class="chain chain-now">
            <p class="chain-k">${c.currentTitle}<span>${c.currentSub}</span></p>
            <ul>${c.currentPoints.map(x => `<li>${x}</li>`).join('')}</ul>
          </div>
          <div class="chain chain-next">
            <p class="chain-k">${c.nextTitle}<span>${c.nextSub}</span></p>
            <p class="chain-cap">${c.nextCap}</p>
            <ul class="opps">${c.nextPoints.map(o => `<li><span class="o-t">${o.t}</span><span class="o-d">${o.d}</span></li>`).join('')}</ul>
          </div>
        </div>
    </div>
  </section>

  <section class="sec" id="concept">
    <div class="shell sec-in">
      ${rail(c.conceptLabel)}
      <div class="body">
        <h2>${c.conceptTitle}</h2>
        <p class="intro">${c.conceptNote}</p>
        <ul class="cards">
          ${c.concepts.map(k => `<li class="card">
            <p class="card-top"><span class="card-kind">${k.kind}</span><span class="card-tag">${c.conceptTag}</span></p>
            <p class="card-title">${k.title}</p>
            <p class="card-meta">${k.meta}</p>
            <p class="card-body">${k.body}</p>
          </li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="shell sec-in">
      ${rail(c.principlesLabel)}
      <div class="body">
        <p class="hmw-l">${c.hmwLabel}</p>
        <p class="hmw">${c.hmw}</p>
        <ul class="principles">
          ${c.principles.map(p => `<li><span class="pr-t">${p.t}</span><span class="pr-e">${p.e}</span><span class="pr-d">${p.d}</span></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <section class="sec" id="directions">
    <div class="shell sec-in">
      ${rail(c.directionsLabel)}
      <div class="body">
        <h2>${c.directionsTitle}</h2>
        <ol class="dirs">
          ${c.directions.map(d => `<li><span class="d-n">${d.n}</span><span class="d-t">${d.t}</span><span class="d-d">${d.d}</span></li>`).join('\n          ')}
        </ol>
        <div class="stage">
          <p class="stage-t">${c.stageTitle}</p>
          <p class="stage-d">${c.stageText}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="subscribe" class="sec">
    <div class="shell sec-in">
      ${rail(c.subLabel)}
      <div class="body sub-grid">
        <div class="sub-l">
          <h2>${c.subTitle}</h2>
          <p class="intro">${c.subText}</p>
        </div>
        <div class="sub-r">
          <form id="subscribe-form" class="form">
            <label class="em-l" for="email">${c.emailLabel}</label>
            <div class="em-row">
              <input id="email" name="email" type="email" autocomplete="email" placeholder="${c.emailPlaceholder}" maxlength="254" required aria-describedby="email-help form-status">
              <button id="submit-button" class="btn" type="submit">${c.ctaPrimary}</button>
            </div>
            <div class="hp" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
            <label class="consent"><input name="consent" id="consent" type="checkbox" required><span>${c.consent}</span></label>
            <p id="form-status" class="status" role="status" aria-live="polite"></p>
            <p class="privacy" id="email-help">${c.consentNote}</p>
            <p class="privacy-note">${c.privacyText}</p>${STATIC ? `
            <p class="static-note">${c.staticNote}</p>` : ''}
          </form>
          <div id="success" class="success" hidden role="status" tabindex="-1">
            <p class="s-k">${c.successLabel}</p>
            <h3>${c.successTitle}</h3>
            <p class="s-t">${c.successLead} <strong id="saved-email"></strong> ${c.successAfter}<br>${c.successText}</p>
            <button class="link-quiet" id="reset-form" type="button">${c.reset}</button>
          </div>
        </div>
        <div class="faq">
          <h3 class="faq-h">${c.faqTitle}</h3>
          ${c.faqs.map(f => `<div class="qa"><p class="qa-q">${f.q}</p><p class="qa-a">${f.a}</p></div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

</main>

<footer class="foot">
  <div class="shell foot-in">
    <p class="foot-brand">Pet Companionship<small>${c.footerNote}</small></p>
    <p class="foot-links">
      <a href="/${other}/" lang="${otherLang}" hreflang="${other}">${c.footerLang}</a>
      <span>${c.copyright}</span>
    </p>
  </div>
  <div class="shell"><p class="src">${c.sourceNote}${sourceLinks[c.lang === 'en' ? 'en' : 'zh']}</p></div>
</footer>
</body>
</html>
`;
};

for (const [locale, c] of Object.entries(content)) {
  mkdirSync(`${OUT}/${locale}`, { recursive: true });
  let out = html(c);
  if (ORIGIN !== '__SITE_ORIGIN__') out = out.replaceAll('__SITE_ORIGIN__', ORIGIN);
  if (STATIC) out = out.replaceAll('__ROBOTS__', 'index, follow');
  out = withBase(out);
  writeFileSync(`${OUT}/${locale}/index.html`, out);
  console.log('wrote', `${OUT}/${locale}/index.html`);
}

if (STATIC) {
  const zhUrl = `${SITE}zh/`;
  writeFileSync(`${OUT}/index.html`, `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pet Companionship · 宠物远程陪伴</title>
<meta http-equiv="refresh" content="0; url=${BASE}zh/">
<link rel="canonical" href="${zhUrl}">
<link rel="alternate" hreflang="zh-CN" href="${SITE}zh/">
<link rel="alternate" hreflang="en" href="${SITE}en/">
</head>
<body>
<p><a href="${BASE}zh/">中文</a> · <a href="${BASE}en/">English</a></p>
</body>
</html>
`);
  writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
  writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['zh', 'en'].map((l) => `<url><loc>${SITE}${l}/</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE}zh/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}en/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}zh/"/></url>`).join('')}</urlset>`);
  // the static host needs its own copy of the stylesheet, script and assets
  for (const f of ['style.css', 'app.js', 'favicon.svg', 'og-zh.jpg', 'og-en.jpg']) cpSync(`public/${f}`, `${OUT}/${f}`);
  if (IMGS !== 'none') cpSync('public/assets', `${OUT}/assets`, { recursive: true });
  cpSync('public/fonts', `${OUT}/fonts`, { recursive: true });
  writeFileSync(`${OUT}/.nojekyll`, '');
  console.log('wrote', `${OUT}/index.html`, 'robots.txt', 'sitemap.xml', '.nojekyll');
}
