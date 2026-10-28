'use strict';
// Auto-guardado en el aula autenticada: conserva el avance por usuario.
(()=>{
 const label=document.querySelector('#progress-status');
 if(!label)return;
 let enabled=false,restoring=false,timer=null,queue=Promise.resolve();
 const fields=['evidencia','dialogo','propuesta'];
 const selector=id=>document.getElementById(id);
 function snapshot(){
  const radio={};
  for(const name of ['q1','q2'])radio[name]=document.querySelector('input[name="'+name+'"]:checked')?.value||'';
  const texts={},rubric={};
  for(const name of fields)texts[name]=selector(name)?.value?.slice(0,1300)||'';
  for(let i=0;i<4;i++)rubric['skill-'+i]=selector('skill-'+i)?.value||'';
  return {radio,fields:texts,rubric};
 }
 function restore(data){
  if(!data)return;
  restoring=true;
  for(const name of ['q1','q2']){
   const choice=data.radio?.[name];
   const control=[...document.querySelectorAll('input[name="'+name+'"]')].find(x=>x.value===choice);
   if(control)control.checked=true;
  }
  for(const name of fields){if(typeof data.fields?.[name]==='string'&&selector(name))selector(name).value=data.fields[name]}
  for(let i=0;i<4;i++){
   const node=selector('skill-'+i),value=data.rubric?.['skill-'+i];
   if(node && [...node.options].some(o=>o.value===value))node.value=value;
  }
  restoring=false;
 }
 async function commit(){
  if(!enabled)return;
  const state=snapshot();
  queue=queue.catch(()=>{}).then(async()=>{
   label.textContent='Guardando progreso…';
   const res=await fetch('/api/progress',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({progress:state})});
   if(!res.ok)throw Error('No se pudo guardar. Pulsa «Guardar avance» nuevamente.');
   label.textContent='Avance guardado en tu cuenta. Podrás retomarlo con un nuevo PIN.';
  });
  return queue.catch(e=>{label.textContent=e.message});
 }
 function schedule(){if(!enabled||restoring)return;clearTimeout(timer);timer=setTimeout(commit,750)}
 document.querySelector('#reto')?.addEventListener('input',schedule);
 document.querySelector('#reto')?.addEventListener('change',schedule);
 document.querySelector('#save-progress')?.addEventListener('click',async()=>{clearTimeout(timer);await commit()});
 document.querySelector('#reset')?.addEventListener('click',()=>setTimeout(()=>{if(enabled)schedule()},20));
 (async()=>{
  try{
   const session=await fetch('/api/auth',{credentials:'same-origin',cache:'no-store'});
   if(!session.ok)throw Error();
   const body=await session.json();
   if(!body.user){label.textContent='Inicia sesión para recuperar tu progreso.';return}
   const response=await fetch('/api/progress',{credentials:'same-origin',cache:'no-store'});
   if(!response.ok)throw Error();
   const saved=await response.json();
   restore(saved.progress);
   enabled=true;
   label.textContent=saved.progress?'Se recuperó tu avance anterior. Los cambios se guardan automáticamente.':'Sesión iniciada: los cambios se guardan automáticamente en tu cuenta.';
  }catch{label.textContent='El guardado de avance estará disponible al completar la configuración de D1.'}
 })();
})();
