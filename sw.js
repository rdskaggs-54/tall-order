// Tall Order offline cache. The build script bumps VERSION on every build.
const VERSION='tall-order-v21';
const SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return r;}).catch(()=>caches.match('index.html')));return;}
  if(url.origin===location.origin||url.hostname.endsWith('gstatic.com')||url.hostname.endsWith('googleapis.com')){
    e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(req);const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r;}).catch(()=>hit);return hit||net;}));
  }
});
