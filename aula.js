'use strict';
// Cada bloque se abre a demanda. No revela el recorrido en la portada pública.
document.querySelectorAll('.activity-step').forEach(el=>{
 el.addEventListener('toggle',()=>{
  if(!el.open||window.__coasociaPrinting)return;
  document.querySelectorAll('.activity-step').forEach(other=>{if(other!==el)other.open=false});
 });
});
async function adjustRole(){
 try{
  const response=await fetch('/api/auth',{cache:'no-store',credentials:'same-origin'});
  if(!response.ok)throw Error('Sesión inválida');
  const data=await response.json();
  if(!data.user){location.replace('/acceso.html');return}
  document.querySelectorAll('.teacher-only').forEach(el=>el.hidden=data.user.role!=='docente');
 }catch{location.replace('/acceso.html')}
}
function openHash(){
 const id=decodeURIComponent(location.hash.slice(1));
 if(!id)return;
 const node=document.getElementById(id);if(!node)return;
 if(node.closest('#reto'))document.querySelector('#reto').open=true;
 if(node.tagName==='DETAILS')node.open=true;
 node.scrollIntoView({behavior:'smooth',block:'start'});
}
window.addEventListener('hashchange',openHash);
adjustRole();
if(location.hash)window.setTimeout(openHash,60);
