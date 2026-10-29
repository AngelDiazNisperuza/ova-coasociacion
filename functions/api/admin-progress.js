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
  // Un mismo estudiante conserva los registros de cada experiencia por separado.
  // Solo la cuenta administradora puede consultar identificadores ajenos a sus grupos.
  const [water,reading]=await Promise.all([
   env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?')
    .bind(id,'reto-agua-01').first(),
   env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?')
    .bind(id,'lectura-critica-11-v1').first()
  ]);
  return response({ok:true,student:user.username,
   progress:water?JSON.parse(water.data):null,updatedAt:water?.updated_at??null,
   readingProgress:reading?JSON.parse(reading.data):null,readingUpdatedAt:reading?.updated_at??null});
 }catch{return error('No se pudo consultar el avance.',503)}
}
