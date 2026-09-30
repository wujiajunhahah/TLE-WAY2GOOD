import http from 'node:http';
import { readFile, mkdir, appendFile } from 'node:fs/promises';
import { resolve, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
const root=dirname(fileURLToPath(import.meta.url));
const publicRoot=resolve(root,'public');
const dataRoot=process.env.DATA_DIR ? resolve(process.env.DATA_DIR) : resolve(root,'data');
const port=Number(process.env.PORT)||4317;
const configuredOrigin=new URL(process.env.SITE_URL||`http://localhost:${port}`);
if(!['http:','https:'].includes(configuredOrigin.protocol)||configuredOrigin.username||configuredOrigin.password||configuredOrigin.pathname!=='/'||configuredOrigin.search||configuredOrigin.hash)throw new Error('SITE_URL must be a plain HTTP(S) origin.');
const siteOrigin=configuredOrigin.origin;
const isPublic=Boolean(process.env.SITE_URL)&&!['localhost','127.0.0.1','[::1]'].includes(configuredOrigin.hostname);
const robots=isPublic?'index, follow':'noindex, nofollow';
const attempts=new Map();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2'};
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
const server=http.createServer(async(req,res)=>{
 try {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  const url=new URL(req.url,'http://localhost');
  let clean;try{clean=normalize(decodeURIComponent(url.pathname));}catch{res.writeHead(400,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Bad request');}
  if(['/','/index.html','/zh','/en','/zh/index.html','/en/index.html'].includes(clean)&&['GET','HEAD'].includes(req.method)){
   const locale=url.pathname.startsWith('/en')?'en':'zh';res.writeHead(308,{Location:`/${locale}/${url.search}`});return res.end();
  }
  if(['/robots.txt','/sitemap.xml'].includes(url.pathname)&&['GET','HEAD'].includes(req.method)){
   const sitemap=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['zh','en'].map(locale=>`<url><loc>${siteOrigin}/${locale}/</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="${siteOrigin}/zh/"/><xhtml:link rel="alternate" hreflang="en" href="${siteOrigin}/en/"/><xhtml:link rel="alternate" hreflang="x-default" href="${siteOrigin}/zh/"/></url>`).join('')}</urlset>`;
   const body=url.pathname==='/robots.txt'?`User-agent: *\n${isPublic?'Allow: /\nDisallow: /api/\nDisallow: /data/':'Disallow: /'}\nSitemap: ${siteOrigin}/sitemap.xml\n`:sitemap;
   res.writeHead(200,{'Content-Type':url.pathname==='/robots.txt'?'text/plain; charset=utf-8':'application/xml; charset=utf-8'});return res.end(req.method==='HEAD'?undefined:body);
  }
  if(url.pathname==='/api/subscribe'){
   if(req.method!=='POST') return json(res,405,{error:'请通过订阅表单提交。'});
   if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}` && req.headers.origin!==`https://${req.headers.host}`) return json(res,403,{error:'请在项目页面提交。'});
   if(!String(req.headers['content-type']).startsWith('application/json')) return json(res,415,{error:'提交格式不正确。'});
   const key=req.socket.remoteAddress; const now=Date.now();const history=(attempts.get(key)||[]).filter(t=>now-t<60000);
   if(history.length>=8) return json(res,429,{error:'提交有些频繁，请一分钟后再试。'});
   attempts.set(key,[...history,now]);
   let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>4096)return json(res,413,{error:'提交内容过长。'});}
   let body;try{body=JSON.parse(raw)}catch{return json(res,400,{error:'提交格式不正确。'})}
   if(!body||typeof body!=='object'||Array.isArray(body))return json(res,400,{error:'提交格式不正确。'});
   if(body.website) return json(res,400,{error:'请重新提交。'});
   const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
   if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json(res,400,{error:'请填写有效的邮箱地址。'});
   if(body.consent!==true)return json(res,400,{error:'请先同意接收项目邮件。'});
   await mkdir(dataRoot,{recursive:true,mode:0o700});
   await appendFile(resolve(dataRoot,'subscribers.jsonl'),JSON.stringify({id:randomUUID(),email,createdAt:new Date().toISOString(),consentVersion:'2026-09-30',source:'landing-page',language:body.language==='en'?'en':'zh'})+'\n',{mode:0o600});
   return json(res,201,{ok:true});
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  const pagePath=['/zh/','/en/'].includes(clean)?clean+'index.html':clean;
  const path=resolve(publicRoot,'.'+pagePath);
  if(!path.startsWith(publicRoot+'/')){res.writeHead(403);return res.end();}
  let file=await readFile(path);if(extname(path)==='.html'){file=file.toString().replaceAll('__SITE_ORIGIN__',siteOrigin).replaceAll('__ROBOTS__',robots);}
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:file);
 }catch(error){if(['ENOENT','EISDIR','ENOTDIR'].includes(error.code)){res.writeHead(404);res.end('Page not found');}else{console.error('Request failed:',error.code||error.name);json(res,500,{error:'暂时没有保存成功，请稍后再试。'});}}
});
setInterval(()=>{const now=Date.now();for(const[key,list]of attempts)if(list.every(t=>now-t>60000))attempts.delete(key);},60000).unref();
server.listen(Number(process.env.PORT)||4317,process.env.HOST||'127.0.0.1',()=>console.log(`Pet Companionship preview: http://localhost:${Number(process.env.PORT)||4317}`));
