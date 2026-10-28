import {response,error,dbReady,validOrigin,input,userName,hashPassword,activeUser,now} from '../_lib/security.js';

async function permission(env,request){
 const teacher=await activeUser(env,request);
 return teacher?.role==='docente' ? teacher : null;
}
async function ownedStudent(env,teacherId,studentId){
 return env.DB.prepare("SELECT u.id,u.username,u.active,u.class_id,c.name AS class_name FROM users u JOIN classes c ON c.id=u.class_id WHERE u.id=? AND u.role='estudiante' AND c.teacher_id=?")
  .bind(studentId,teacherId).first();
}
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta conectar D1.',503);
 try{
  const teacher=await permission(env,request);
  if(!teacher)return error('Acceso exclusivo a docentes.',403);
  const result=await env.DB.prepare("SELECT u.id,u.username,u.active,u.class_id,c.name AS class_name FROM users u JOIN classes c ON c.id=u.class_id WHERE u.role='estudiante' AND c.teacher_id=? ORDER BY c.name,u.username LIMIT 1000").bind(teacher.id).all();
  return response({ok:true,students:result.results||[]});
 }catch{return error('No fue posible obtener estudiantes.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta conectar D1.',503);
 try{
  const teacher=await permission(env,request);
  if(!teacher)return error('Acceso exclusivo a docentes.',403);
  const data=await input(request);
  if(typeof data.id!=='string'||data.id.length>90)return error('Estudiante inválido.');
  const student=await ownedStudent(env,teacher.id,data.id);
  if(!student)return error('No se encuentra el estudiante en tus clases.',404);
  switch(data.action){
   case 'rename':{
    const name=userName(data.username);
    if(!name)return error('Escribe un usuario válido de 4 a 24 caracteres.');
    await env.DB.prepare("UPDATE users SET username=? WHERE id=? AND role='estudiante'")
      .bind(name,student.id).run();
    return response({ok:true,message:'Nombre de usuario actualizado.'});
   }
   case 'reset_pin':{
    // Se genera con aleatoriedad criptográfica; nunca se recupera ni se almacena el PIN original.
    const numbers=new Uint32Array(1);crypto.getRandomValues(numbers);
    const pin=String(numbers[0]%10000).padStart(4,'0');
    const record=await hashPassword(pin);
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET password_hash=?,salt=?,iterations=? WHERE id=? AND role='estudiante'").bind(record.hash,record.salt,record.iterations,student.id),
      env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(student.id)
    ]);
    // Los datos de actividad_progress permanecen vinculados al mismo id.
    return response({ok:true,pin,message:'PIN renovado; el progreso del usuario se conserva. Comparte el PIN de forma privada.'});
   }
   case 'delete':{
    // Borrado definitivo, por petición explícita del docente, incluidos los avances.
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(student.id),
      env.DB.prepare("DELETE FROM activity_progress WHERE user_id=?").bind(student.id),
      env.DB.prepare("DELETE FROM users WHERE id=? AND role='estudiante'").bind(student.id)
    ]);
    return response({ok:true,message:'Usuario y progreso eliminados definitivamente.'});
   }
   default:return error('Acción no reconocida.');
  }
 }catch(e){
  if(String(e?.message||'').includes('UNIQUE constraint failed'))return error('Ese nombre de usuario ya existe.',409);
  return error('No se completó la gestión. Revisa la estructura de D1.',503);
 }
}
