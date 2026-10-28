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
  document.querySelectorAll('[data-for]').forEach(el=>{el.hidden=(el.dataset.for==='docente'&&!teacher)||(el.dataset.for==='estudiante'&&teacher)||(el.dataset.for==='coordinador'&&!(teacher&&data.user.coordinator));});
  $('#dashboard').hidden=false;$('#loading').hidden=true;
  showView('inicio');
  $('#coord-panel').hidden=!(teacher&&data.user.coordinator);
  if(teacher){await loadClasses();await loadStudents();}else{await loadOwnProgress();}
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
   const renew=document.createElement('button');renew.type='button';renew.className='link-button';renew.textContent='Nuevo código';
   renew.setAttribute('aria-label','Generar nuevo código para '+c.name);
   renew.addEventListener('click',async()=>{
    if(!window.confirm('¿Generar un nuevo código para '+c.name+'? El anterior dejará de funcionar, pero se conservarán los estudiantes.'))return;
    renew.disabled=true;
    try{const result=await post('/api/classes',{action:'renew_code',id:c.id});showClassCode(result.code,c.name,true)}
    catch(err){$('#class-result').textContent=err.message||'No se pudo renovar el código.'}
    finally{renew.disabled=false}
   });
   box.append(name,count,renew);target.append(box);
  }
 }catch(err){$('#class-list').textContent=err.message||'No fue posible cargar las clases.'}
}
function showClassCode(code,className,renewed=false){
 const target=$('#class-result');target.replaceChildren();
 const lead=document.createElement('p');
 lead.textContent=(renewed?'Nuevo código de ':'Código de ')+className+' para compartir con estudiantes:';
 const value=document.createElement('strong');value.textContent=code;
 const note=document.createElement('p');
 note.textContent=(renewed?'El código anterior quedó invalidado. ':'')+'Este código se muestra una sola vez. Consérvalo antes de salir.';
 target.append(lead,value,note);
}
$('#class-form').addEventListener('submit',async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const name=new FormData(form).get('name');
 const button=form.querySelector('button');button.disabled=true;
 try{
  const data=await post('/api/classes',{action:'create',name});
  showClassCode(data.code,name);
  form.reset();
  await loadClasses();
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
$('#spin')?.addEventListener('click',()=>{
 if(turning)return;turning=true;
 const index=crypto.getRandomValues(new Uint32Array(1))[0]%missions.length;
 rotation+=720+360*(index/missions.length)+27;
 $('#wheel').style.transform='rotate('+rotation+'deg)';
 $('#mission').textContent='Girando…';$('#spin').disabled=true;
 window.setTimeout(()=>{$('#mission').textContent=missions[index];$('#spin').disabled=false;turning=false},1100);
});
load();


// Gestión de cuentas de los estudiantes de las clases del docente conectado.
// El servidor verifica propiedad de la clase antes de aceptar cualquier cambio.
async function loadStudents(){
 const target=$('#students-list'), status=$('#students-message');
 target.replaceChildren();status.textContent='Consultando estudiantes…';
 try{
  const r=await fetch('/api/students',{credentials:'same-origin',cache:'no-store'});
  const data=await r.json();
  if(!r.ok||!data.ok)throw Error(data.error||'No se pudo abrir el listado');
  status.textContent=data.students.length?'':'Sin estudiantes registrados todavía.';
  for(const student of data.students){
   const card=document.createElement('div');card.className='student-item';
   const details=document.createElement('div');details.className='student-info';
   const name=document.createElement('strong');name.textContent=student.username;
   const cls=document.createElement('span');cls.textContent=student.class_name+' · '+(student.active?'Cuenta activa':'Cuenta desactivada');
   details.append(name,cls);
   const actions=document.createElement('div');actions.className='student-actions';
   const rename=document.createElement('button');rename.type='button';rename.className='link-button';rename.textContent='Editar usuario';
   rename.addEventListener('click',async()=>{
    const username=window.prompt('Nuevo nombre de usuario:',student.username);
    if(username===null||username.trim()===student.username)return;
    await manageStudent({action:'rename',id:student.id,username});
   });
   const reset=document.createElement('button');reset.type='button';reset.className='link-button';reset.textContent='Nuevo PIN';
   reset.addEventListener('click',async()=>{
    if(!window.confirm('¿Generar un nuevo PIN para '+student.username+'? Se cerrarán sus sesiones y se conservará su progreso.'))return;
    await manageStudent({action:'reset_pin',id:student.id},true);
   });
   const view=document.createElement('button');view.type='button';view.className='link-button';view.textContent='Ver progreso';
   view.addEventListener('click',()=>showStudentProgress(student.id,student.username));
   const del=document.createElement('button');del.type='button';del.className='link-button danger';del.textContent='Eliminar';
   del.addEventListener('click',async()=>{
    const typed=window.prompt('ELIMINACIÓN DEFINITIVA. Se borrarán la cuenta y sus actividades. Escribe '+student.username+' para confirmar:');
    if(typed!==student.username)return;
    await manageStudent({action:'delete',id:student.id});
   });
   actions.append(view,rename,reset,del);card.append(details,actions);target.append(card);
  }
 }catch(e){status.textContent=e.message||'No se pudo consultar la lista.'}
}
async function manageStudent(payload,showPin=false){
 const message=$('#students-message');message.replaceChildren();
 try{
  const data=await post('/api/students',payload);
  if(showPin&&data.pin){
   const note=document.createElement('span');note.textContent='PIN nuevo para compartir una sola vez: ';
   const pin=document.createElement('strong');pin.textContent=data.pin;
   const note2=document.createElement('span');note2.textContent=' · '+data.message;
   message.append(note,pin,note2);
   // Conservar el aviso hasta la siguiente acción: el PIN no se guarda en el navegador.
   await loadStudents();
   message.replaceChildren(note,pin,note2);
  }else{
   await loadStudents();
   message.textContent=data.message||'Actualización completada.';
  }
 }catch(e){message.textContent=e.message||'Operación no completada.'}
}
$('#refresh-students')?.addEventListener('click',loadStudents);


// Las invitaciones solo pueden emitirse por el primer docente, comprobado en el servidor.
$('#make-teacher-invite')?.addEventListener('click',async()=>{
 const button=$('#make-teacher-invite'),box=$('#teacher-invite-result');
 button.disabled=true;box.replaceChildren();
 try{
  const d=await post('/api/teacher-invites',{action:'create'});
  const p=document.createElement('p');p.textContent='Código para un nuevo docente (un uso, 72 horas):';
  const key=document.createElement('strong');key.textContent=d.code;
  const note=document.createElement('p');note.textContent='Comparte el código en privado. El profesor debe abrir /acceso.html?rol=docente y seleccionar «Crear cuenta docente».';
  box.append(p,key,note);
 }catch(e){box.textContent=e.message||'No se pudo crear la invitación.'}
 finally{button.disabled=false}
});
// Lectura protegida en la API: solo estudiantes de las clases del docente conectado.
async function showStudentProgress(id,name){
 const out=$('#student-progress-detail');
 out.hidden=false;out.replaceChildren();
 const heading=document.createElement('h3');heading.textContent='Avances de '+name;out.append(heading);
 try{
  const r=await fetch('/api/student-progress?id='+encodeURIComponent(id),{credentials:'same-origin',cache:'no-store'});
  const info=await r.json();
  if(!r.ok||!info.ok)throw Error(info.error||'No se pudo obtener el progreso.');
  const group=document.createElement('p');group.textContent='Grupo: '+info.student.className;out.append(group);
  if(!info.progress){const p=document.createElement('p');p.textContent='El estudiante todavía no ha guardado respuestas en el Reto 01.';out.append(p);return}
  const date=document.createElement('p');
  date.textContent='Última actualización: '+new Date(info.updatedAt*1000).toLocaleString('es-CO');out.append(date);
  const items=[
   ['Pregunta de investigación',info.progress.radio?.q1],
   ['Cálculo con datos',info.progress.radio?.q2],
   ['Evidencias',info.progress.fields?.evidencia],
   ['Diálogo',info.progress.fields?.dialogo],
   ['Propuesta del equipo',info.progress.fields?.propuesta],
   ['Comunicación',info.progress.rubric?.['skill-0']],
   ['Pensamiento crítico',info.progress.rubric?.['skill-1']],
   ['Resolución de problemas',info.progress.rubric?.['skill-2']],
   ['Colaboración',info.progress.rubric?.['skill-3']]
  ];
  const dl=document.createElement('dl');dl.className='progress-list';
  for(const [key,value] of items){const dt=document.createElement('dt');dt.textContent=key;const dd=document.createElement('dd');dd.textContent=value||'Sin respuesta';dl.append(dt,dd)}
  out.append(dl);
  out.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){const p=document.createElement('p');p.textContent=e.message||'Error de consulta';out.append(p)}
}


// Panel compacto: una sola sección visible, distinta para cada perfil.
function showView(name){
 const btn=[...document.querySelectorAll('[data-view-button]')].find(b=>b.dataset.viewButton===name&&!b.hidden);
 if(!btn)return;
 document.querySelectorAll('.dash-view').forEach(block=>{block.hidden=block.dataset.view!==name});
 document.querySelectorAll('[data-view-button]').forEach(b=>{const active=b.dataset.viewButton===name;b.classList.toggle('selected',active);b.setAttribute('aria-current',active?'page':'false')});
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-view-button]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewButton)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.go)));
async function loadOwnProgress(){
 const node=document.querySelector('#own-progress');if(!node)return;
 try{
  const r=await fetch('/api/progress',{credentials:'same-origin',cache:'no-store'});
  const data=await r.json();
  if(!r.ok||!data.ok)throw Error(data.error||'No se pudo consultar el avance');
  if(!data.progress){node.textContent='Todavía no has guardado respuestas. Abre la primera unidad para comenzar.';return}
  const p=data.progress;
  const answerCount=['q1','q2'].filter(k=>!!p.radio?.[k]).length+
   ['evidencia','dialogo','propuesta'].filter(k=>!!p.fields?.[k]?.trim()).length+
   [0,1,2,3].filter(i=>!!p.rubric?.['skill-'+i]).length;
  node.replaceChildren();
  const strong=document.createElement('strong');strong.textContent='Avance recuperado';
  const detail=document.createElement('p');detail.textContent='Campos respondidos: '+answerCount+' de 9';
  const date=document.createElement('p');date.textContent=data.updatedAt?'Última actualización: '+new Date(data.updatedAt*1000).toLocaleString('es-CO'):'';
  node.append(strong,detail,date);
 }catch(e){node.textContent=e.message||'No fue posible mostrar el avance.'}
}
