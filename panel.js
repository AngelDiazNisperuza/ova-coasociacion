'use strict';
const $=s=>document.querySelector(s);
async function post(url,obj){
 const res=await fetch(url,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify(obj)});
 const data=await res.json();
 if(!res.ok||!data.ok)throw Error(data.error||'La solicitud no pudo completarse.');
 return data;
}
async function load(){
 try{
  const r=await fetch('/api/auth',{cache:'no-store',credentials:'same-origin'});
  const data=await r.json();
  if(!r.ok||!data.user)throw Error('Inicia sesión para usar tu espacio.');
  $('#welcome').textContent='Bienvenido, '+data.user.username;
  const teacher=data.user.role==='docente';
  $('#subtitle').textContent=teacher?'Área de acompañamiento y administración de clases.':'Área de aprendizaje y actividades colaborativas.';
  $('#teacher-panel').hidden=!teacher;
  $('#student-panel').hidden=teacher;
  $('#dashboard').hidden=false;$('#loading').hidden=true;
  if(teacher)await loadClasses();
 }catch(err){$('#loading-message').textContent=err.message||'No se pudo verificar la sesión.'}
}
async function loadClasses(){
 try{
  const res=await fetch('/api/classes',{cache:'no-store',credentials:'same-origin'});
  const data=await res.json();if(!res.ok||!data.ok)throw Error(data.error||'No se encontraron clases.');
  const target=$('#class-list');target.replaceChildren();
  if(!data.classes.length){target.textContent='Todavía no hay clases registradas.';return}
  for(const c of data.classes){
   const box=document.createElement('div');box.className='class-item';
   const name=document.createElement('strong');name.textContent=c.name;
   const count=document.createElement('span');count.textContent='Participantes: '+c.students;
   box.append(name,count);target.append(box);
  }
 }catch(err){$('#class-list').textContent=err.message||'No fue posible cargar las clases.'}
}
$('#class-form').addEventListener('submit',async e=>{
 e.preventDefault();const name=new FormData(e.currentTarget).get('name');
 const button=e.currentTarget.querySelector('button');button.disabled=true;
 try{
  const data=await post('/api/classes',{action:'create',name});
  const target=$('#class-result');target.replaceChildren();
  const lead=document.createElement('p');lead.textContent='Código para compartir con tus estudiantes (cópialo ahora):';
  const code=document.createElement('strong');code.textContent=data.code;
  const note=document.createElement('p');note.textContent='El código no se volverá a mostrar por seguridad.';
  target.append(lead,code,note);e.currentTarget.reset();await loadClasses();
 }catch(err){$('#class-result').textContent=err.message||'No se pudo crear la clase.'}
 finally{button.disabled=false}
});
$('#logout').addEventListener('click',async()=>{
 try{await post('/api/auth',{action:'logout'});}catch{}
 location.assign('/acceso.html');
});
const missions=[
 'Comunicación: explica a tu equipo el problema del agua en 40 segundos, usando una evidencia.',
 'Pensamiento crítico: cuestiona un dato y explica qué necesitarías comprobar.',
 'Colaboración: pregunta a otra persona qué solución propone y resume su argumento.',
 'Resolución de problemas: imagina dos acciones viables y compara sus consecuencias.',
 'Creatividad: dibuja un mensaje para promover el cuidado del agua en la institución.',
 'Coasociación: acuerda con tu equipo una decisión y explica cómo llegaron al consenso.'
];
let turning=false,rotation=0;
$('#spin').addEventListener('click',()=>{
 if(turning)return;turning=true;
 const index=crypto.getRandomValues(new Uint32Array(1))[0]%missions.length;
 rotation+=720+360*(index/missions.length)+27;
 $('#wheel').style.transform='rotate('+rotation+'deg)';
 $('#mission').textContent='Girando…';$('#spin').disabled=true;
 window.setTimeout(()=>{$('#mission').textContent=missions[index];$('#spin').disabled=false;turning=false},1100);
});
load();
