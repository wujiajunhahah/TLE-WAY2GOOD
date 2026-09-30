// Same server contract as before (POST /api/subscribe, JSON body, honeypot, 15s timeout),
// with copy moved into the two locales and one restrained reveal gesture.
const en = document.documentElement.lang === 'en';
const m = en
  ? { saving: 'Saving…', submit: 'Get project updates', failed: 'We couldn’t confirm your signup. Please try again.', timeout: 'The connection timed out. Your signup has not been confirmed.', network: 'Connection lost. Your signup has not been confirmed.', rate: 'Too many attempts. Please try again in a minute.', invalid: 'Please enter a valid email and agree to receive updates.' }
  : { saving: '正在保存…', submit: '订阅项目进展', failed: '暂时没有确认保存成功，请稍后重试。', timeout: '连接超时，尚未确认保存。请稍后重试。', network: '网络连接出了点问题，还没有确认保存。请稍后重试。', rate: '提交有些频繁，请一分钟后再试。', invalid: '请填写有效邮箱并同意接收项目邮件。' };

// Static hosting (GitHub Pages) has no /api/subscribe: use the build's base path and say so
// plainly instead of showing a generic failure.
const pageBase = document.querySelector('meta[name="pc-base"]')?.content || '/';
const isStatic = document.querySelector('meta[name="pc-mode"]')?.content === 'static';
const staticMsg = en ? 'This is a static preview — signups can’t be saved here yet.' : '当前为静态预览，订阅暂未开启保存。';
m.staticHost = staticMsg;

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
    const response = await fetch(pageBase + 'api/subscribe', {
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
    status.textContent = isStatic
      ? staticMsg
      : error.name === 'AbortError' ? m.timeout : error instanceof TypeError ? m.network : error.message;
  } finally {
    clearTimeout(timer);
    submit.disabled = false;
    submit.textContent = m.submit;
    form.removeAttribute('aria-busy');
  }
});

document.querySelector('#reset-form').addEventListener('click', () => {
  form.reset();
  form.hidden = false;
  document.querySelector('#success').hidden = true;
  status.textContent = '';
  form.email.focus();
});
