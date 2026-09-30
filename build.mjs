// Renders public/{zh,en}/index.html from content.mjs.
// Identity: a printed research brief. A sticky left rail carries each section's number and
// label; hairline rules divide sections. The two-way thesis is carried structurally
// (the five-moment timeline, paired columns, arrow chains) and semantically by colour
// (owner / today = deep green, pet / opportunity = clay).
// Layout variety is deliberate: hero, fact band, timeline, evidence + table, full-bleed photo,
// dark pivot band, principle grid, numbered rows, form panel. Nothing repeats seven times.
// Run: node build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { content, sourceLinks } from './content.mjs';

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
<meta property="og:image" content="__SITE_ORIGIN__/assets/hero.jpg">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${c.ogLocaleAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${c.desc}">
<meta name="twitter:image" content="__SITE_ORIGIN__/assets/hero.jpg">
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
<body>
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
      <figure class="hero-fig rv">
        <img src="/assets/hero.jpg" width="1056" height="922" alt="${c.heroAlt}" fetchpriority="high" decoding="async">
      </figure>
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
            <span class="step-d">${s.d}</span>${s.isBreak ? `<span class="step-tag">${c.breakLabel}</span>` : ''}
          </li>`).join('\n          ')}
        </ol>
        <blockquote class="break">
          <p class="break-l">${c.breakLabel}</p>
          <p class="break-t">${c.breakText}</p>
        </blockquote>
      </div>
    </div>
    <figure class="bleed">
      <img src="/assets/away.jpg" width="810" height="274" alt="${c.awayCaption}" decoding="async">
      <figcaption class="shell">${c.awayCaption}</figcaption>
    </figure>
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
          <figure class="devices">
            <img src="/assets/devices.jpg" width="780" height="396" alt="${c.devicesAlt}" decoding="async">
            <figcaption>${c.devicesCaption}</figcaption>
          </figure>
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
          <img src="/assets/hold.jpg" width="466" height="448" alt="" decoding="async" aria-hidden="true">
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
        <div class="chains">
          <div class="chain chain-now">
            <p class="chain-k">${c.currentTitle}<span>${c.currentSub}</span></p>
            <p class="chain-line">${chain(c.currentChain, '→')}</p>
            <p class="chain-cap">${c.currentCap}</p>
            <ul>${c.currentPoints.map(x => `<li>${x}</li>`).join('')}</ul>
          </div>
          <div class="chain chain-next">
            <p class="chain-k">${c.nextTitle}<span>${c.nextSub}</span></p>
            <p class="chain-line">${chain(c.nextChain, '↔')}</p>
            <p class="chain-cap">${c.nextCap}</p>
            <ul class="opps">${c.nextPoints.map(o => `<li><span class="o-t">${o.t}</span><span class="o-d">${o.d}</span></li>`).join('')}</ul>
          </div>
        </div>
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
          <div class="faq">
            <h3 class="faq-h">${c.faqTitle}</h3>
            ${c.faqs.map(f => `<div class="qa"><p class="qa-q">${f.q}</p><p class="qa-a">${f.a}</p></div>`).join('\n            ')}
          </div>
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
            <p class="privacy-note">${c.privacyText}</p>
          </form>
          <div id="success" class="success" hidden role="status" tabindex="-1">
            <p class="s-k">${c.successLabel}</p>
            <h3>${c.successTitle}</h3>
            <p class="s-t">${c.successLead} <strong id="saved-email"></strong> ${c.successAfter}<br>${c.successText}</p>
            <button class="link-quiet" id="reset-form" type="button">${c.reset}</button>
          </div>
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
  mkdirSync(`public/${locale}`, { recursive: true });
  const out = `public/${locale}/index.html`;
  writeFileSync(out, html(c));
  console.log('wrote', out);
}
