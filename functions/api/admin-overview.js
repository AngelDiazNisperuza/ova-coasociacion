import {response,error,dbReady,validOrigin,input,userName,hashPassword,now,activeUser,isAdministrator,constantCompare,random,digest} from '../_lib/security.js';

// Panel exclusivo de supervisión. El ID del primer docente define la cuenta administradora.
async function authorized(env,request){const u=await activeUser(env,request);return await isAdministrator(env,u)?u:null}
const validId=id=>typeof id==='string'&&/^[a-f0-9-]{36}$/i.test(id);
async function newPin(){
 const a=new Uint32Array(1),limit=4294967296-(4294967296%10000);let n;
 do{crypto.getRandomValues(a);n=a[0]}while(n>=limit);
 return String(n%10000).padStart(4,'0');
}
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Base de datos D1 no conectada.',503);
 try{
  const admin=await authorized(env,request);
  if(!admin)return error('Acceso exclusivo al Centro de Gestión.',403);
  const [g,s]=await Promise.all([
   env.DB.prepare("SELECT c.id,c.name,c.active,c.teacher_id,t.username AS teacher_name,t.active AS teacher_active,COUNT(u.id) AS students FROM classes c JOIN users t ON t.id=c.teacher_id LEFT JOIN users u ON u.class_id=c.id AND u.role='estudiante' GROUP BY c.id ORDER BY t.username,c.name LIMIT 5000").all(),
   env.DB.prepare("SELECT u.id,u.username,u.active,u.class_id,c.name AS class_name,c.teacher_id,t.username AS teacher_name,COUNT(p.activity_id) AS activities FROM users u LEFT JOIN classes c ON c.id=u.class_id LEFT JOIN users t ON t.id=c.teacher_id LEFT JOIN activity_progress p ON p.user_id=u.id WHERE u.role='estudiante' GROUP BY u.id ORDER BY u.username LIMIT 5000").all()
  ]);
  const groups=g.results||[],students=s.results||[];
  return response({ok:true,groups,students,summary:{teachers:null,groups:groups.length,students:students.length,completed:students.filter(s=>Number(s.activities)>0).length}});
 }catch{return error('No se pudieron cargar grupos y estudiantes.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Base de datos D1 no conectada.',503);
 let d;try{d=await input(request)}catch{return error('Solicitud incorrecta.')}
 try{
  const admin=await authorized(env,request);
  if(!admin)return error('Acceso exclusivo al Centro de Gestión.',403);
  if(typeof env.ADMIN_SETUP_KEY!=='string'||env.ADMIN_SETUP_KEY.length<24)return error('Falta la clave de coordinación en Cloudflare.',503);
  if(!await constantCompare(d.adminKey,env.ADMIN_SETUP_KEY))return error('Clave de coordinación incorrecta.',403);
  const op=String(d.action||'');
  if(op==='create_student'){
   const username=userName(d.username),classId=d.classId;
   if(!username||!validId(classId))return error('Se requiere un usuario válido y un grupo.');
   const cls=await env.DB.prepare("SELECT c.id,c.teacher_id,t.active FROM classes c JOIN users t ON t.id=c.teacher_id WHERE c.id=? AND c.active=1 AND t.active=1 AND t.role='docente'").bind(classId).first();
   if(!cls||cls.teacher_id===admin.id)return error('Selecciona un grupo activo de otro docente.',403);
   const count=await env.DB.prepare("SELECT COUNT(*) AS total FROM users WHERE role='estudiante' AND class_id=?").bind(classId).first();
   if(count.total>=50)return error('Este grupo ya alcanzó 50 estudiantes.',409);
   const pin=await newPin(),h=await hashPassword(pin),id=crypto.randomUUID();
   await env.DB.prepare("INSERT INTO users(id,username,role,password_hash,salt,iterations,class_id,created_at) VALUES (?,?,'estudiante',?,?,?,?,?)")
    .bind(id,username,h.hash,h.salt,h.iterations,classId,now()).run();
   return response({ok:true,pin,message:'Estudiante creado. Comunica el PIN de forma privada; se muestra una vez.'},201);
  }
  if(op.startsWith('student_')){
   if(!validId(d.id))return error('Estudiante inválido.');
   const student=await env.DB.prepare("SELECT id,active FROM users WHERE id=? AND role='estudiante'").bind(d.id).first();
   if(!student)return error('Estudiante inexistente.',404);
   if(op==='student_rename'){
    const name=userName(d.username);if(!name)return error('Usuario inválido.');
    await env.DB.prepare("UPDATE users SET username=? WHERE id=? AND role='estudiante'").bind(name,d.id).run();
    return response({ok:true,message:'Nombre de estudiante actualizado.'});
   }
   if(op==='student_reset_pin'){
    const pin=await newPin(),h=await hashPassword(pin);
    await env.DB.batch([
     env.DB.prepare("UPDATE users SET password_hash=?,salt=?,iterations=? WHERE id=? AND role='estudiante'").bind(h.hash,h.salt,h.iterations,d.id),
     env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(d.id)
    ]);
    return response({ok:true,pin,message:'PIN renovado. Progreso conservado y sesiones anteriores cerradas.'});
   }
   if(op==='student_deactivate'||op==='student_reactivate'){
    const active=op==='student_reactivate'?1:0;
    const statements=[env.DB.prepare("UPDATE users SET active=? WHERE id=? AND role='estudiante'").bind(active,d.id)];
    if(active===0)statements.push(env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(d.id));
    await env.DB.batch(statements);
    return response({ok:true,message:active?'Estudiante reactivado.':'Estudiante desactivado; respuestas y grupo conservados.'});
   }
   if(op==='student_delete'){
    const progress=await env.DB.prepare("SELECT COUNT(*) AS total FROM activity_progress WHERE user_id=?").bind(d.id).first();
    if(Number(progress.total)>0)return error('Este estudiante tiene progreso almacenado. Desactiva su cuenta para conservarlo.',409);
    await env.DB.batch([
     env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(d.id),
     env.DB.prepare("DELETE FROM users WHERE id=? AND role='estudiante' AND NOT EXISTS (SELECT 1 FROM activity_progress WHERE user_id=?)").bind(d.id,d.id)
    ]);
    return response({ok:true,message:'Cuenta sin progreso eliminada.'});
   }
  }
  if(op.startsWith('group_')){
   if(!validId(d.id))return error('Grupo inválido.');
   const cls=await env.DB.prepare('SELECT id,teacher_id,active FROM classes WHERE id=?').bind(d.id).first();
   if(!cls)return error('Grupo inexistente.',404);
   if(op==='group_rename'){
    const name=typeof d.name==='string'?d.name.trim():'';
    if(name.length<3||name.length>60)return error('Nombre de grupo entre 3 y 60 caracteres.');
    await env.DB.prepare('UPDATE classes SET name=? WHERE id=?').bind(name,d.id).run();
    return response({ok:true,message:'Nombre de grupo actualizado.'});
   }
   if(op==='group_reassign'){
    if(!validId(d.teacherId)||d.teacherId===admin.id)return error('Selecciona un docente distinto del Centro de Gestión.');
    const t=await env.DB.prepare("SELECT id FROM users WHERE id=? AND role='docente' AND active=1").bind(d.teacherId).first();
    if(!t)return error('Docente inexistente o desactivado.',404);
    const count=await env.DB.prepare('SELECT COUNT(*) AS total FROM classes WHERE teacher_id=?').bind(d.teacherId).first();
    if(cls.teacher_id!==d.teacherId && Number(count.total)>=20)return error('El docente ya tiene 20 grupos.',409);
    await env.DB.prepare('UPDATE classes SET teacher_id=? WHERE id=?').bind(d.teacherId,d.id).run();
    return response({ok:true,message:'Grupo reasignado. Estudiantes, respuestas y código se conservan.'});
   }
   if(op==='group_deactivate'||op==='group_reactivate'){
    const active=op==='group_reactivate'?1:0;
    await env.DB.prepare('UPDATE classes SET active=? WHERE id=?').bind(active,d.id).run();
    return response({ok:true,message:active?'Grupo reactivado.':'Grupo desactivado. Los registros se conservan.'});
   }
   if(op==='group_new_code'){
    if(cls.teacher_id===admin.id)return error('Reasigna primero el grupo a un docente.');
    const code=random(12).toUpperCase().replaceAll('-','A').replaceAll('_','B');
    await env.DB.prepare('UPDATE classes SET join_code_hash=? WHERE id=?').bind(await digest(code),d.id).run();
    return response({ok:true,code,message:'Nuevo código de clase generado. El anterior quedó invalidado.'});
   }
  }
  return error('Acción no reconocida.');
 }catch(e){
  if(String(e?.message||'').includes('UNIQUE constraint'))return error('El nombre ya está registrado.',409);
  if(String(e?.message||'').includes('FOREIGN KEY constraint'))return error('Existen registros vinculados que deben conservarse.',409);
  return error('No se pudo guardar el cambio. Verifica D1.',503);
 }
}
