'use strict';
const $=s=>document.querySelector(s);
const roles=[...document.querySelectorAll('[data-role]')];
const tabs=[...document.querySelectorAll('[data-mode]')];
let role=new URLSearchParams(location.search).get('rol')==='docente'?'docente':'estudiante';
let mode='login';
let firstTeacherAvailable=true;
let activeSession=null;
function render(){
  roles.forEach(b=>{const active=b.dataset.role===role;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  const modes=role==='docente'?(firstTeacherAvailable?['login','register_teacher','setup']:['login','register_teacher']):['login','register'];
  if(!modes.includes(mode))mode='login';
  const signedIn=Boolean(activeSession);
  document.querySelector('.tabs').hidden=signedIn;
  tabs.forEach(b=>{b.hidden=!modes.includes(b.dataset.mode);b.classList.toggle('selected',b.dataset.mode===mode)});
  ['login','register','register_teacher','setup'].forEach(k=>$('#form-'+k).hidden=signedIn||mode!==k);
  $('#active-session').hidden=!signedIn;
  if(signedIn){
   $('#active-session-user').textContent=activeSession.username;
   $('#active-session-role').textContent=activeSession.role==='docente'?'docente':'estudiante';
  }
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
for(const action of ['login','register','register_teacher','setup']){
  const form=$('#form-'+action);
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const submit=form.querySelector('button[type="submit"]');
    submit.disabled=true;$('#form-message').textContent='Verificando datos…';
    try{
      const fields=Object.fromEntries(new FormData(form).entries());
      if(action==='login')fields.role=role;
      const result=await api(action,fields);
      if(result.user){location.assign('/panel.html');return}
      $('#form-message').textContent='Operación completada.';
    }catch(err){$('#form-message').textContent=err.message||'No se pudo completar el proceso.'}
    finally{submit.disabled=false}
  });
}
$('#switch-account').addEventListener('click',async()=>{
 const button=$('#switch-account');button.disabled=true;
 try{
  await api('logout',{});
  activeSession=null;
  $('#form-login').reset();
  render();
  $('#service-status').textContent='Sesión anterior cerrada. Puedes ingresar con otra cuenta.';
 }catch(err){$('#form-message').textContent=err.message||'No fue posible cerrar la sesión.'}
 finally{button.disabled=false}
});
(async()=>{
 try{
  const response=await fetch('/api/auth',{cache:'no-store',credentials:'same-origin'});
  const data=await response.json();
  if(!response.ok){$('#service-status').textContent='Configuración pendiente: '+(data.error||'revisa la base de datos');return}
  firstTeacherAvailable=data.setupAvailable!==false;
  render();
  $('#service-status').textContent='Acceso disponible · Sesiones protegidas';
  activeSession=data.user||null;
  render();
 }catch{$('#service-status').textContent='Acceso en preparación: no se detecta el servicio de autenticación.'}
})();
render();
