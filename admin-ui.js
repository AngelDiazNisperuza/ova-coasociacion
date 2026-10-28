'use strict';
// Gestión central, sin introducir contenido didáctico en el perfil administrador.
let adminOverview=null;
let adminTeachers=[];
const aEl=id=>document.getElementById(id);
function adminNotice(target,message,pin=null,code=null){
 const el=aEl(target);el.replaceChildren();
 const label=document.createElement('span');label.textContent=message||'Cambio realizado.';el.append(label);
 const secret=pin||code;
 if(secret){const p=document.createElement('p');p.textContent=(pin?'PIN nuevo: ':'Código nuevo: ');
  const strong=document.createElement('strong');strong.textContent=secret;
  const note=document.createElement('span');note.textContent=' · Cópialo ahora; no volverá a mostrarse.';
  p.append(strong,note);el.append(p)}
}
function control(label,action){
 const b=document.createElement('button');b.type='button';b.className='link-button';b.textContent=label;
 b.addEventListener('click',action);return b;
}
async function adminAction(payload,target){
 const field=aEl('teacher-admin-key'),adminKey=field.value;
 field.value='';
 if(!adminKey){adminNotice(target,'Introduce la clave de coordinación, situada encima del menú.');return}
 try{
  const data=await post('/api/admin-overview',{...payload,adminKey});
  await loadAdminOverview();
  adminNotice(target,data.message,data.pin,data.code);
 }catch(e){adminNotice(target,e.message||'No se pudo realizar el cambio.')}
}
async function loadAdminOverview(){
 const teachersResponse=await fetch('/api/teachers',{credentials:'same-origin',cache:'no-store'});
 const teachersData=await teachersResponse.json();
 if(!teachersResponse.ok||!teachersData.ok)throw Error(teachersData.error||'No se pudieron consultar docentes.');
 adminTeachers=teachersData.teachers;
 const r=await fetch('/api/admin-overview',{credentials:'same-origin',cache:'no-store'});
 const d=await r.json();
 if(!r.ok||!d.ok)throw Error(d.error||'No se pudo cargar la supervisión.');
 adminOverview=d;
 buildAdminOverview();
}
function buildAdminOverview(){
 const data=adminOverview;
 if(!data)return;
 const summary=aEl('admin-summary');summary.replaceChildren();
 const stats=[
  ['Docentes',adminTeachers.length,'Cuentas docentes invitadas'],
  ['Grupos',data.groups.length,'Grupos registrados'],
  ['Estudiantes',data.students.length,'Cuentas registradas'],
  ['Con avances',data.students.filter(s=>Number(s.activities)>0).length,'Estudiantes con actividades guardadas']
 ];
 for(const [label,value,note] of stats){
  const card=document.createElement('div');card.className='quick-card';
  const tag=document.createElement('span');tag.className='quick-tag';tag.textContent=label;
  const num=document.createElement('strong');num.textContent=String(value);
  const sub=document.createElement('span');sub.textContent=note;
  card.append(tag,num,sub);summary.append(card);
 }
 const select=aEl('admin-student-class');const current=select.value;select.replaceChildren();
 const initial=document.createElement('option');initial.value='';initial.textContent='Selecciona un grupo';select.append(initial);
 for(const group of data.groups.filter(g=>g.active&&g.teacher_active&&adminTeachers.some(t=>t.id===g.teacher_id&&t.active))){
  const o=document.createElement('option');o.value=group.id;o.textContent=group.name+' · '+group.teacher_name;
  select.append(o);
 }
 if([...select.options].some(o=>o.value===current))select.value=current;
 renderAdminStudents(data.students);
 renderAdminGroups(data.groups);
}
function renderAdminStudents(students){
 const target=aEl('admin-student-list');target.replaceChildren();
 if(!students.length){target.textContent='Sin estudiantes registrados.';return}
 for(const student of students){
  const item=document.createElement('article');item.className='teacher-admin-item';
  const info=document.createElement('div');info.className='teacher-admin-info';
  const title=document.createElement('strong');title.textContent=student.username;
  const details=document.createElement('span');
  details.textContent=(student.active?'Activo':'Desactivado')+' · '+(student.class_name||'Sin grupo')+' · '+(student.teacher_name||'Sin docente')+' · '+student.activities+' actividad(es) guardada(s)';
  info.append(title,details);item.append(info);
  const actions=document.createElement('div');actions.className='teacher-admin-actions';
  actions.append(
   control('Editar',async()=>{
    const username=window.prompt('Nuevo seudónimo:',student.username);
    if(username!==null&&username.trim()&&username.trim()!==student.username)
      await adminAction({action:'student_rename',id:student.id,username},'admin-student-result');
   }),
   control('Nuevo PIN',async()=>{
    if(window.confirm('¿Renovar PIN de '+student.username+' sin perder su progreso?'))
      await adminAction({action:'student_reset_pin',id:student.id},'admin-student-result');
   }),
   control(student.active?'Desactivar':'Reactivar',async()=>{
    const op=student.active?'student_deactivate':'student_reactivate';
    if(window.confirm('¿'+(student.active?'Desactivar':'Reactivar')+' la cuenta '+student.username+'?'))
      await adminAction({action:op,id:student.id},'admin-student-result');
   }),
   control('Ver avance',async()=>{
    try{
      const r=await fetch('/api/admin-progress?id='+encodeURIComponent(student.id),{credentials:'same-origin',cache:'no-store'});
      const d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||'Sin detalle disponible');
      const target=aEl('admin-student-result');target.replaceChildren();
      const heading=document.createElement('strong');heading.textContent='Avance de '+student.username;target.append(heading);
      if(!d.progress){
       const p=document.createElement('p');p.textContent='Aún no hay respuestas guardadas.';target.append(p);
      }else{
       const p=document.createElement('p');p.textContent='Última actualización: '+(d.updatedAt?new Date(d.updatedAt*1000).toLocaleString('es-CO'):'sin fecha');target.append(p);
       const answers=[
        ['Indagación',d.progress.radio?.q1||'Sin respuesta'],
        ['Interpretación de datos',d.progress.radio?.q2||'Sin respuesta'],
        ['Evidencias',d.progress.fields?.evidencia||'Sin respuesta'],
        ['Diálogo',d.progress.fields?.dialogo||'Sin respuesta'],
        ['Propuesta',d.progress.fields?.propuesta||'Sin respuesta']
       ];
       for(let i=0;i<4;i++)answers.push(['Autoevaluación '+(i+1),d.progress.rubric?.['skill-'+i]||'Sin respuesta']);
       for(const [label,value] of answers){
        const row=document.createElement('p');
        const bold=document.createElement('strong');bold.textContent=label+': ';
        const span=document.createElement('span');span.textContent=value;
        row.append(bold,span);target.append(row);
       }
      }
    }catch(e){adminNotice('admin-student-result',e.message)}
   })
  );
  if(Number(student.activities)===0){
   actions.append(control('Eliminar',async()=>{
    const name=window.prompt('Para eliminar la cuenta sin progreso, escribe exactamente '+student.username+':');
    if(name===student.username)await adminAction({action:'student_delete',id:student.id},'admin-student-result');
   }));
  }
  item.append(actions);target.append(item);
 }
}
function renderAdminGroups(groups){
 const target=aEl('admin-group-list');target.replaceChildren();
 if(!groups.length){target.textContent='Todavía no hay grupos.';return}
 for(const group of groups){
  const box=document.createElement('article');box.className='teacher-admin-item';
  const info=document.createElement('div');info.className='teacher-admin-info';
  const name=document.createElement('strong');name.textContent=group.name+(group.active?'':' · Inactivo');
  const detail=document.createElement('span');detail.textContent=(group.teacher_name||'Sin docente')+' · '+group.students+' estudiante(s)';
  info.append(name,detail);box.append(info);
  const actions=document.createElement('div');actions.className='teacher-admin-actions';
  actions.append(
   control('Renombrar',async()=>{
    const name=window.prompt('Nuevo nombre del grupo:',group.name);
    if(name!==null&&name.trim()&&name.trim()!==group.name)
     await adminAction({action:'group_rename',id:group.id,name},'admin-group-result');
   }),
   control('Reasignar',async()=>{
    const names=adminTeachers.filter(t=>t.active).map(t=>t.username);
    if(!names.length){adminNotice('admin-group-result','No hay docentes activos para recibir este grupo.');return}
    const typed=window.prompt('Escribe el usuario del docente receptor:\n'+names.join(', '));
    if(typed===null)return;
    const teacher=adminTeachers.find(t=>t.active&&t.username.toLowerCase()===typed.trim().toLowerCase());
    if(!teacher){adminNotice('admin-group-result','Docente no encontrado en la lista de activos.');return}
    if(window.confirm('¿Asignar '+group.name+' a '+teacher.username+' y conservar sus estudiantes?'))
     await adminAction({action:'group_reassign',id:group.id,teacherId:teacher.id},'admin-group-result');
   }),
   control(group.active?'Desactivar':'Reactivar',async()=>{
    if(window.confirm('¿Cambiar el estado de '+group.name+'?'))
     await adminAction({action:group.active?'group_deactivate':'group_reactivate',id:group.id},'admin-group-result');
   }),
   control('Nuevo código',async()=>{
    if(window.confirm('¿Reemplazar el código anterior de '+group.name+'?'))
     await adminAction({action:'group_new_code',id:group.id},'admin-group-result');
   })
  );box.append(actions);target.append(box);
 }
}
aEl('admin-create-student')?.addEventListener('submit',async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const username=form.elements.namedItem('username').value;
 const classId=form.elements.namedItem('classId').value;
 if(!classId){adminNotice('admin-student-result','Selecciona un grupo.');return}
 await adminAction({action:'create_student',username,classId},'admin-student-result');
 form.elements.namedItem('username').value='';
});
