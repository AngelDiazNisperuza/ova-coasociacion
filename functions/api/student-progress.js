import {response,error,dbReady,activeUser,isAdministrator} from '../_lib/security.js';

export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta D1.',503);
 try{
  const teacher=await activeUser(env,request);
  if(teacher?.role!=='docente'||await isAdministrator(env,teacher))return error('Acceso exclusivo a docentes de grupo.',403);
  const id=new URL(request.url).searchParams.get('id');
  if(!id || !/^[a-f0-9-]{36}$/i.test(id))return error('Estudiante inválido.');
  const student=await env.DB.prepare("SELECT u.id,u.username,c.name AS class_name FROM users u JOIN classes c ON c.id=u.class_id WHERE u.id=? AND u.role='estudiante' AND c.teacher_id=?")
   .bind(id,teacher.id).first();
  if(!student)return error('Ese estudiante no pertenece a tus grupos.',403);
  const row=await env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?')
   .bind(id,'reto-agua-01').first();
  const reading=await env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?')
   .bind(id,'lectura-critica-11-v1').first();
  return response({ok:true,student:{username:student.username,className:student.class_name},
   progress:row?JSON.parse(row.data):null,updatedAt:row?.updated_at??null,
   readingProgress:reading?JSON.parse(reading.data):null,readingUpdatedAt:reading?.updated_at??null});
 }catch{return error('No fue posible consultar el progreso. Comprueba la tabla activity_progress.',503)}
}
