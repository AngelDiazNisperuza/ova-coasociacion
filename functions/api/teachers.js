import {response,error,dbReady,validOrigin,input,userName,hashPassword,activeUser,constantCompare} from '../_lib/security.js';

async function coordinator(env,request){
 const user=await activeUser(env,request);
 if(user?.role!=='docente')return null;
 const oldest=await env.DB.prepare("SELECT id FROM users WHERE role='docente' ORDER BY created_at,id LIMIT 1").first();
 return oldest?.id===user.id?user:null;
}
function uuid(x){return typeof x==='string'&&/^[0-9a-f-]{36}$/i.test(x)}
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta conectar D1.',503);
 try{
  const admin=await coordinator(env,request);
  if(!admin)return error('Acceso exclusivo a coordinación.',403);
  const u=await env.DB.prepare("SELECT id,username,active FROM users WHERE role='docente' ORDER BY created_at,id LIMIT 250").all();
  const c=await env.DB.prepare("SELECT c.id,c.teacher_id,c.name,c.active,COUNT(s.id) AS students FROM classes c LEFT JOIN users s ON s.class_id=c.id AND s.role='estudiante' GROUP BY c.id ORDER BY c.created_at DESC LIMIT 5000").all();
  const teachers=(u.results||[]).map(t=>{
   const own=(c.results||[]).filter(x=>x.teacher_id===t.id);
   return {id:t.id,username:t.username,active:!!t.active,coordinator:t.id===admin.id,classCount:own.length,
    studentCount:own.reduce((sum,x)=>sum+Number(x.students||0),0),
    classes:own.map(x=>({name:x.name,active:!!x.active,students:Number(x.students||0)}))};
  });
  return response({ok:true,teachers});
 }catch{return error('No se pudo consultar el listado docente.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta conectar D1.',503);
 let data;try{data=await input(request)}catch{return error('Solicitud incorrecta.')}
 try{
  const admin=await coordinator(env,request);
  if(!admin)return error('Acceso exclusivo a coordinación.',403);
  if(typeof env.ADMIN_SETUP_KEY!=='string'||env.ADMIN_SETUP_KEY.length<24)
   return error('Falta configurar la clave de coordinación en Cloudflare.',503);
  if(!await constantCompare(data.adminKey,env.ADMIN_SETUP_KEY))return error('Clave de coordinación incorrecta.',403);
  if(!uuid(data.id))return error('Identificador de docente inválido.');
  if(data.id===admin.id)return error('No puedes modificar la cuenta coordinadora desde aquí.',403);
  const teacher=await env.DB.prepare("SELECT id,username,active FROM users WHERE id=? AND role='docente'").bind(data.id).first();
  if(!teacher)return error('Docente no encontrado.',404);
  const id=teacher.id;
  if(data.action==='rename'){
   const username=userName(data.username);
   if(!username)return error('Introduce un usuario válido de 4 a 24 caracteres.');
   await env.DB.prepare("UPDATE users SET username=? WHERE id=? AND role='docente'").bind(username,id).run();
   return response({ok:true,message:'Usuario modificado. Grupos y avances conservados.'});
  }
  if(data.action==='reset_pin'){
   const bytes=new Uint32Array(1),max=4294967296-4294967296%10000;let value;
   do{crypto.getRandomValues(bytes);value=bytes[0]}while(value>=max);
   const pin=String(value%10000).padStart(4,'0'),h=await hashPassword(pin);
   await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_hash=?,salt=?,iterations=? WHERE id=? AND role='docente'").bind(h.hash,h.salt,h.iterations,id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id)
   ]);
   return response({ok:true,pin,message:'PIN renovado. Las sesiones anteriores se cerraron.'});
  }
  if(data.action==='deactivate'){
   if(!teacher.active)return error('La cuenta ya está desactivada.',409);
   await env.DB.batch([
    env.DB.prepare("UPDATE users SET active=0 WHERE id=? AND role='docente' AND active=1").bind(id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id)
   ]);
   return response({ok:true,message:'Docente desactivado; grupos, estudiantes y avances intactos.'});
  }
  if(data.action==='reactivate'){
   if(teacher.active)return error('La cuenta ya está activa.',409);
   await env.DB.prepare("UPDATE users SET active=1 WHERE id=? AND role='docente' AND active=0").bind(id).run();
   return response({ok:true,message:'Cuenta docente reactivada.'});
  }
  if(data.action==='delete'){
   const check=await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total FROM classes WHERE teacher_id=?").bind(id).first(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM activity_progress WHERE user_id=?").bind(id).first(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM teacher_invites WHERE created_by=?").bind(id).first()
   ]);
   if(check.some(x=>Number(x.total)>0))return error('La cuenta conserva grupos, avances o invitaciones. Desactívala para preservar sus datos.',409);
   const results=await env.DB.batch([
    env.DB.prepare("UPDATE teacher_invites SET used_by=NULL WHERE used_by=?").bind(id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id),
    env.DB.prepare("DELETE FROM users WHERE id=? AND role='docente' AND NOT EXISTS (SELECT 1 FROM classes WHERE teacher_id=?) AND NOT EXISTS (SELECT 1 FROM activity_progress WHERE user_id=?) AND NOT EXISTS (SELECT 1 FROM teacher_invites WHERE created_by=?)").bind(id,id,id,id)
   ]);
   if(results[2]?.meta?.changes!==1)return error('No se pudo eliminar la cuenta debido a registros vinculados.',409);
   return response({ok:true,message:'Cuenta docente eliminada. No tenía grupos ni avances.'});
  }
  return error('Acción no reconocida.');
 }catch(e){
  if(String(e?.message||'').includes('UNIQUE constraint'))return error('El usuario ya está ocupado.',409);
  if(String(e?.message||'').includes('FOREIGN KEY constraint'))return error('Esta cuenta conserva datos vinculados. Utiliza Desactivar.',409);
  return error('No se pudo completar la gestión; comprueba la base D1.',503);
 }
}
