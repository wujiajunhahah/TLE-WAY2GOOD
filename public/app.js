// Same server contract as before (POST /api/subscribe, JSON body, honeypot, 15s timeout),
// with copy moved into the two locales and one restrained reveal gesture.
const en = document.documentElement.lang === 'en';
const m = en
  ? { saving: 'Saving…', submit: 'Get project updates', failed: 'We couldn’t confirm your signup. Please try again.', timeout: 'The connection timed out. Your signup has not been confirmed.', network: 'Connection lost. Your signup has not been confirmed.', rate: 'Too many attempts. Please try again in a minute.', invalid: 'Please enter a valid email and agree to receive updates.' }
  : { saving: '正在保存…', submit: '订阅项目进展', failed: '暂时没有确认保存成功，请稍后重试。', timeout: '连接超时，尚未确认保存。请稍后重试。', network: '网络连接出了点问题，还没有确认保存。请稍后重试。', rate: '提交有些频繁，请一分钟后再试。', invalid: '请填写有效邮箱并同意接收项目邮件。' };

const signupAPI = document.querySelector('meta[name="pc-subscribe-api"]')?.content || '';

// Web fonts change the height of the long research page after the browser's first
// fragment jump. Align a deep link once layout settles, unless the visitor has moved on.
const initialHash = location.hash;
if (initialHash) {
  let interacted = false;
  const noticeInteraction = () => { interacted = true; };
  for (const type of ['wheel', 'touchmove', 'pointerdown', 'keydown']) {
    window.addEventListener(type, noticeInteraction, { once: true, passive: true });
  }
  const alignFragment = async () => {
    await document.fonts.ready;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!interacted && location.hash === initialHash) {
        try {
          document.getElementById(decodeURIComponent(initialHash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' });
        } catch { /* An invalid URL fragment must not break signup. */ }
      }
      for (const type of ['wheel', 'touchmove', 'pointerdown', 'keydown']) window.removeEventListener(type, noticeInteraction);
    }));
  };
  if (document.readyState === 'complete') alignFragment();
  else window.addEventListener('load', alignFragment, { once: true });
}

const switchLink = document.querySelector('.nav .lang');
if (switchLink) {
  const base = switchLink.getAttribute('href');
  const sync = () => { switchLink.href = base + location.hash; };
  sync();
  window.addEventListener('hashchange', sync);
}

const form = document.querySelector('#subscribe-form');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#submit-button');

if (form && signupAPI) {
submit.disabled = false;
const submitLabel = submit.textContent;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submit.disabled) return;
  const submittedEmail = form.email.value.trim();
  status.textContent = '';
  submit.disabled = true;
  submit.textContent = m.saving;
  form.setAttribute('aria-busy', 'true');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(signupAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ email: submittedEmail, consent: form.consent.checked, website: form.website.value, language: en ? 'en' : 'zh' })
    });
    let result;
    try { result = await response.json(); } catch { throw new Error(m.failed); }
    if (!response.ok || !result.ok) {
      throw new Error(response.status === 429 ? m.rate : response.status === 400 ? m.invalid : m.failed);
    }
    document.querySelector('#saved-email').textContent = submittedEmail;
    form.hidden = true;
    const success = document.querySelector('#success');
    success.hidden = false;
    success.focus();
  } catch (error) {
    status.textContent = error.name === 'AbortError' ? m.timeout : error instanceof TypeError ? m.network : error.message;
  } finally {
    clearTimeout(timer);
    submit.disabled = false;
    submit.textContent = submitLabel;
    form.removeAttribute('aria-busy');
  }
});

document.querySelector('#reset-form').addEventListener('click', () => {
  form.reset();
  form.hidden = false;
  document.querySelector('#success').hidden = true;
  document.querySelector('#saved-email').textContent = '';
  status.textContent = '';
  form.email.focus();
});
}

document.querySelector('#copy-link')?.addEventListener('click', async () => {
  const copyStatus = document.querySelector('#copy-status');
  const link = new URL(location.href);
  link.hash = '';
  try {
    await navigator.clipboard.writeText(link.href);
    copyStatus.textContent = en ? 'Link copied. Save it or share it with a friend.' : '链接已复制，可以保存或分享给朋友。';
  } catch {
    copyStatus.textContent = en ? 'Copy the page address from your browser to save or share it.' : '请从浏览器地址栏复制链接，保存或分享这个页面。';
  }
});

// The connection diagram draws itself once, when it enters the viewport.
// Without JS the diagram is already complete (see .net.css defaults).
const netFig = document.querySelector('.net, .arch-panel');
if (netFig) {
  if ('IntersectionObserver' in window) {
    netFig.classList.add('js');
    const netIO = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('in'); netIO.unobserve(entry.target); }
    }, { threshold: 0.2 });
    netIO.observe(netFig);
  }
}

// ── the brand cat ────────────────────────────────────────────────────────────
// Capability, not user-agent. A coarse pointer has no cursor to follow and no leave to
// animate, and iOS Safari keeps :hover applied after a tap, so the stylesheet gates its
// hover rules behind the same query. Everything here is decoration: if the visitor has
// asked for less motion, none of it is registered at all.
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The cat watches the pointer. The head leans and turns toward wherever the cursor is and
// the pupils travel inside the eyes, so entering from the left and from the right do not
// look the same, and circling the figure keeps its attention.
//
// Two things are per-figure. The magnitudes: the header mark's head is 33 units wide and the
// hero cat's is 290, so one shared translate would be invisible on the first and violent on
// the second. And the range: normalising by the head's own width saturates almost instantly
// — the header head is 31px across, so the cat read as binary left/right rather than as
// following. The range is the distance at which the figure has turned as far as it will.
function watchPointer(host, headEl, o) {
  if (!host || !headEl) return;
  const clamp = (v) => (v < -1 ? -1 : v > 1 ? 1 : v);
  // The rect is cached and invalidated on entry, scroll and resize. Reading it inside
  // pointermove would force a style recalc on every event, on a page over 10,000px long.
  let rect = null;
  const aim = (e) => {
    if (!rect || !rect.width) {
      rect = headEl.getBoundingClientRect();
      if (!rect.width) return;
    }
    const x = clamp((e.clientX - (rect.left + rect.width / 2)) / o.rangeX);
    const y = clamp((e.clientY - (rect.top + rect.height / 2)) / o.rangeY);
    headEl.style.transform = `translate(${(x * o.lean).toFixed(2)}px, ${(y * o.rise).toFixed(2)}px) rotate(${(x * o.rot).toFixed(2)}deg)`;
    if (o.pupils) o.pupils.style.transform = `translate(${(x * o.eyeX).toFixed(2)}px, ${(y * o.eyeY).toFixed(2)}px)`;
  };
  const rest = () => { headEl.style.transform = ''; if (o.pupils) o.pupils.style.transform = ''; };
  const forget = () => { rect = null; };
  host.addEventListener('pointerenter', (e) => { forget(); aim(e); });
  host.addEventListener('pointermove', aim);
  host.addEventListener('pointerleave', () => { rest(); forget(); });
  addEventListener('scroll', forget, { passive: true });
  addEventListener('resize', forget, { passive: true });
}

if (fine && !calm) {
  // The host has to be wider than the mark. Listening on .brand meant the pointer could
  // only ever be to its right — the mark sits at the brand's left edge — so the cat could
  // look right and nowhere else. The header gives it a full horizontal range; the hero
  // panel gives it all four directions.
  const bar = document.querySelector('.top') || document.querySelector('.brand');
  if (bar) watchPointer(bar, bar.querySelector('.w2g-track'), {
    pupils: bar.querySelector('.w2g-pupils'),
    lean: 1.5, rise: 0.9, rot: 8, eyeX: 2.6, eyeY: 1.6,
    rangeX: 460, rangeY: 90,
  });
  const panel = document.querySelector('.arch-panel');
  if (panel) watchPointer(panel, panel.querySelector('.pet-headgroup'), {
    lean: 13, rise: 7, rot: 7, rangeX: 210, rangeY: 200,
  });
}

// On a coarse pointer there is no cursor to follow and no leave to animate. The header
// mark cannot react either way: it sits inside a link, so tapping it navigates and any
// gesture is erased by the reload. The hero cat is not a link, so a tap there is a poke.
if (!fine) {
  const panel = document.querySelector('.arch-panel');
  if (panel) {
    panel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      panel.classList.remove('poked');
      void panel.offsetWidth;   // force a reflow so the animation restarts on every poke
      panel.classList.add('poked');
    });
  }
}
