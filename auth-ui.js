'use strict';
const $=s=>document.querySelector(s);
const roles=[...document.querySelectorAll('[data-role]')];
const tabs=[...document.querySelectorAll('[data-mode]')];
let role=new URLSearchParams(location.search).get('rol')==='docente'?'docente':'estudiante';
let mode='login';
function render(){
  roles.forEach(b=>{const active=b.dataset.role===role;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  const modes=role==='docente'?['login','setup']:['login','register'];
  if(!modes.includes(mode))mode='login';
  tabs.forEach(b=>{b.hidden=!modes.includes(b.dataset.mode);b.classList.toggle('selected',b.dataset.mode===mode)});
  ['login','register','setup'].forEach(k=>$('#form-'+k).hidden=mode!==k);
  $('#form-message').textContent='';
}
roles.forEach(b=>b.addEventListener('click',()=>{role=b.dataset.role;mode='login';history.replaceState({},'',location.pathname+'?rol='+role);render()}));
tabs.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;render()}));
async function api(action,fields){
  const response=await fetch('/api/auth',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({action,...fields})});
  let payload;try{payload=await response.json()}catch{throw Error('El servidor no está disponible.')}
  if(!response.ok || !payload.ok)throw Error(payload.error||'No fue posible completar el acceso.');
  return payload;
}
for(const action of ['login','register','setup']){
  const form=$('#form-'+action);
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const submit=form.querySelector('button[type="submit"]');
    submit.disabled=true;$('#form-message').textContent='Verificando datos…';
    try{
      const fields=Object.fromEntries(new FormData(form).entries());
      const result=await api(action,fields);
      if(result.user){location.assign('/panel.html');return}
      $('#form-message').textContent='Operación completada.';
    }catch(err){$('#form-message').textContent=err.message||'No se pudo completar el proceso.'}
    finally{submit.disabled=false}
  });
}
(async()=>{
 try{
  const response=await fetch('/api/auth',{cache:'no-store',credentials:'same-origin'});
  const data=await response.json();
  if(!response.ok){$('#service-status').textContent='Configuración pendiente: '+(data.error||'revisa la base de datos');return}
  $('#service-status').textContent='Acceso disponible · Sesiones protegidas';
  if(data.user)location.assign('/panel.html');
 }catch{$('#service-status').textContent='Acceso en preparación: no se detecta el servicio de autenticación.'}
})();
render();
