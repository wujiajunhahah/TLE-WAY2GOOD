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

// Wake the brand cat on hover. The class is what gates the leave animation in the
// stylesheet: without it the base-state animation fires on page load. Touch devices
// get the same gesture on tap, since there is no hover to trigger it there.
for (const brand of document.querySelectorAll('.brand')) {
  brand.addEventListener('mouseenter', () => brand.classList.add('was-awake'));
  brand.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    brand.classList.toggle('woke');
    brand.classList.add('was-awake');
  });
}

// The cat watches the pointer: the head leans and turns toward wherever the cursor is,
// so entering from the left and entering from the right do not look the same, and
// circling the figure keeps its attention. Each figure declares its own magnitudes —
// the header mark's head is 33 units wide and the hero cat's is 290, so one shared
// translate would be invisible on the first and violent on the second.
function watchPointer(host, head, lean, rise, rot) {
  if (!host || !head) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const clamp = (v) => (v < -1 ? -1 : v > 1 ? 1 : v);
  // The rect is cached and refreshed on entry, scroll and resize. Reading it inside
  // pointermove would force a style recalc on every event, on a page this long.
  let rect = null;
  const aim = (e) => {
    if (!rect || !rect.width) {
      rect = head.getBoundingClientRect();
      if (!rect.width) return;
    }
    const x = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.9));
    const y = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 1.4));
    head.style.transform = `translate(${(x * lean).toFixed(2)}px, ${(y * rise).toFixed(2)}px) rotate(${(x * rot).toFixed(2)}deg)`;
  };
  const forget = () => { rect = null; };
  host.addEventListener('pointerenter', (e) => { forget(); aim(e); });
  host.addEventListener('pointermove', aim);
  host.addEventListener('pointerleave', () => { head.style.transform = ''; forget(); });
  addEventListener('scroll', forget, { passive: true });
  addEventListener('resize', forget, { passive: true });
}

// The host has to be wider than the mark. Listening on .brand meant the pointer could
// only ever be to the right of it — the mark sits at the brand's left edge — so the cat
// could look right and nowhere else. The whole header gives it a full range.
const barEl = document.querySelector('.top') || document.querySelector('.brand');
if (barEl) watchPointer(barEl, barEl.querySelector('.w2g-track') || document.querySelector('.w2g-track'), 1.7, 1.0, 9);
const heroEl = document.querySelector('.arch-panel');
if (heroEl) watchPointer(heroEl, heroEl.querySelector('.pet-headgroup'), 13, 7, 7);
