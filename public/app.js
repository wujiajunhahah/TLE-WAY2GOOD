const english=document.documentElement.lang==='en';
const messages=english?{saving:'Saving…',submit:'Get email updates',failed:'We couldn’t confirm your signup. Please try again.',timeout:'The connection timed out. Your signup has not been confirmed. Please try again.',network:'Connection lost. Your signup has not been confirmed. Please try again.',rate:'Too many attempts. Please try again in a minute.',invalid:'Please enter a valid email and agree to receive project updates.'}:{saving:'正在保存…',submit:'订阅项目进展',failed:'暂时没有确认保存成功，请稍后重试。',timeout:'连接超时，尚未确认保存。请稍后重试。',network:'网络连接出了点问题，还没有确认保存。请稍后重试。',rate:'提交有些频繁，请一分钟后再试。',invalid:'请填写有效邮箱并同意接收项目邮件。'};
const switchLink=document.querySelector('.language-switch');
if(switchLink){const base=switchLink.getAttribute('href');const update=()=>{switchLink.href=base+location.hash;};update();window.addEventListener('hashchange',update);}
const form=document.querySelector('#subscribe-form');
const status=document.querySelector('#form-status');
const submit=document.querySelector('#submit-button');
form.addEventListener('submit',async event=>{
 event.preventDefault();if(submit.disabled)return;
 const submittedEmail=form.email.value.trim();
 status.textContent='';submit.disabled=true;submit.textContent=messages.saving;form.setAttribute('aria-busy','true');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{
  const response=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({email:submittedEmail,consent:form.consent.checked,website:form.website.value,language:english?'en':'zh'})});
  let result;try{result=await response.json()}catch{throw new Error(messages.failed)}
  if(!response.ok||!result.ok)throw new Error(response.status===429?messages.rate:response.status===400?messages.invalid:messages.failed);
  document.querySelector('#saved-email').textContent=submittedEmail;
  form.hidden=true;const success=document.querySelector('#success');success.hidden=false;success.focus();
 }catch(error){status.textContent=error.name==='AbortError'?messages.timeout:error instanceof TypeError?messages.network:error.message;}
 finally{clearTimeout(timeout);submit.disabled=false;submit.textContent=messages.submit;form.removeAttribute('aria-busy');}
});
document.querySelector('#reset-form').addEventListener('click',()=>{form.reset();form.hidden=false;document.querySelector('#success').hidden=true;status.textContent='';form.email.focus();});
