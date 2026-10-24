import {readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
async function walk(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const files=(await walk('dist')).filter(f=>!f.endsWith('sw.js')&&!f.endsWith('OFL.txt'));
const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));
const cache='kicktale-'+hash.digest('hex').slice(0,12);
const paths=files.map(f=>'./'+f.slice(5));
await writeFile('dist/sw.js',`const CACHE=${JSON.stringify(cache)};const ASSETS=${JSON.stringify(paths)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kicktale-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return;}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});`);
console.log('Offline assets prepared:',paths.length,'files');
