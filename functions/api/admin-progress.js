import {response,error,dbReady,activeUser,isAdministrator} from '../_lib/security.js';
// Supervisión de progreso sin cambios sobre actividades ni usuarios.
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('D1 no conectada.',503);
 try{
  const admin=await activeUser(env,request);
  if(!await isAdministrator(env,admin))return error('Solo el Centro de Gestión puede consultar.',403);
  const id=new URL(request.url).searchParams.get('id');
  if(!id||!/^[0-9a-f-]{36}$/i.test(id))return error('Estudiante inválido.');
  const user=await env.DB.prepare("SELECT id,username FROM users WHERE id=? AND role='estudiante'").bind(id).first();
  if(!user)return error('Estudiante no encontrado.',404);
  const result=await env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?').bind(id,'reto-agua-01').first();
  const p=result?JSON.parse(result.data):null;
  return response({ok:true,student:user.username,progress:p,updatedAt:result?.updated_at??null});
 }catch{return error('No se pudo consultar el avance.',503)}
}
