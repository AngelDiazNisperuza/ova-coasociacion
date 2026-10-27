// Cloudflare Pages Functions: utilidades privadas, sin credenciales ni tokens en texto plano en D1.
const encoder=new TextEncoder();
const COOKIE='__Host-coasocia_session',ITER=210000,AGE=86400;
export function response(data,status=200,extra={}){
 return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...extra}});
}
export function error(message,status=400){return response({ok:false,error:message},status)}
export function now(){return Math.floor(Date.now()/1000)}
export function dbReady(env){return Boolean(env?.DB?.prepare)}
export function validOrigin(request){const o=request.headers.get('origin');return !!o && o===new URL(request.url).origin}
export async function input(request){
 if(!request.headers.get('content-type')?.toLowerCase().includes('application/json'))throw Error('Formato incorrecto');
 if(Number(request.headers.get('content-length')||0)>4096)throw Error('Exceso de datos');
 const raw=await request.text();if(raw.length>4096)throw Error('Exceso de datos');
 const obj=JSON.parse(raw);if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Datos incorrectos');
 return obj;
}
export function userName(v){
 const s=typeof v==='string'?v.trim().toLowerCase():'';
 return /^[a-z0-9][a-z0-9._-]{3,23}$/.test(s)?s:null;
}
export function passwordOK(v,teacher=false){return typeof v==='string'&&v.length>=(teacher?12:10)&&v.length<=128}
export function random(n=32){
 const b=crypto.getRandomValues(new Uint8Array(n));let s='';for(const x of b)s+=String.fromCharCode(x);
 return btoa(s).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
export async function digest(v){
 const b=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(v)));
 return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
}
async function pbkdf2(pwd,saltHex,iterations){
 const key=await crypto.subtle.importKey('raw',encoder.encode(pwd),'PBKDF2',false,['deriveBits']);
 const salt=new Uint8Array(saltHex.match(/../g).map(x=>parseInt(x,16)));
 const bits=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations,hash:'SHA-256'},key,256));
 return Array.from(bits,x=>x.toString(16).padStart(2,'0')).join('');
}
export async function hashPassword(pwd){
 const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
 return {salt,iterations:ITER,hash:await pbkdf2(pwd,salt,ITER)};
}
export async function verifyPassword(pwd,user){
 const actual=await pbkdf2(pwd,user.salt,user.iterations);
 if(actual.length!==user.password_hash.length)return false;
 let diff=0;for(let i=0;i<actual.length;i++)diff|=actual.charCodeAt(i)^user.password_hash.charCodeAt(i);
 return diff===0;
}
export async function constantCompare(a,b){
 if(typeof a!=='string'||typeof b!=='string')return false;
 const x=await digest(a),y=await digest(b);let diff=0;
 for(let i=0;i<x.length;i++)diff|=x.charCodeAt(i)^y.charCodeAt(i);
 return diff===0;
}
function cookie(request){
 const parts=(request.headers.get('cookie')||'').split(';').map(x=>x.trim());
 const value=parts.find(x=>x.startsWith(COOKIE+'='));
 return value?value.substring(COOKIE.length+1):'';
}
export function clearCookie(){return COOKIE+'=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax'}
export async function createSession(env,userId){
 const token=random(),hash=await digest(token),t=now();
 await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)')
  .bind(hash,userId,t+AGE,t).run();
 return COOKIE+'='+token+'; Path=/; Max-Age='+AGE+'; HttpOnly; Secure; SameSite=Lax';
}
export async function activeUser(env,request){
 const token=cookie(request);if(!/^[A-Za-z0-9_-]{40,64}$/.test(token))return null;
 return env.DB.prepare('SELECT u.id,u.username,u.role,u.class_id FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1')
  .bind(await digest(token),now()).first();
}
export async function removeSession(env,request){
 const token=cookie(request);
 if(token)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(token)).run();
}
async function failureKey(user){return digest('login:'+user)}
export async function locked(env,user){
 const row=await env.DB.prepare('SELECT fails,reset_at FROM auth_failures WHERE key=?').bind(await failureKey(user)).first();
 return !!row&&row.fails>=6&&row.reset_at>now();
}
export async function failure(env,user){
 const key=await failureKey(user),t=now();
 const row=await env.DB.prepare('SELECT fails,reset_at FROM auth_failures WHERE key=?').bind(key).first();
 if(row&&row.reset_at>t)await env.DB.prepare('UPDATE auth_failures SET fails=fails+1 WHERE key=?').bind(key).run();
 else await env.DB.prepare('INSERT INTO auth_failures(key,fails,reset_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET fails=excluded.fails,reset_at=excluded.reset_at').bind(key,1,t+900).run();
}
export async function clearFailures(env,user){
 await env.DB.prepare('DELETE FROM auth_failures WHERE key=?').bind(await failureKey(user)).run();
}
