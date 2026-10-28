import {response,error,now,dbReady,validOrigin,input,random,digest,activeUser} from '../_lib/security.js';
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta D1.',503);
 try{
  const user=await activeUser(env,request);
  if(user?.role!=='docente')return error('Solo docentes administradores.',403);
  const rows=await env.DB.prepare('SELECT c.id,c.name,c.active,COUNT(u.id) AS students FROM classes c LEFT JOIN users u ON u.class_id=c.id WHERE c.teacher_id=? GROUP BY c.id ORDER BY c.created_at DESC')
   .bind(user.id).all();
  return response({ok:true,classes:rows.results||[]});
 }catch{return error('No se pudieron consultar las clases.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta D1.',503);
 try{
  const user=await activeUser(env,request);
  if(user?.role!=='docente')return error('Solo docentes administradores.',403);
  const body=await input(request);
  if(body.action==='renew_code'){
   const id=typeof body.id==='string'?body.id:'';
   if(!/^[0-9a-f-]{36}$/i.test(id))return error('Grupo inválido.');
   const belongs=await env.DB.prepare('SELECT id FROM classes WHERE id=? AND teacher_id=? AND active=1').bind(id,user.id).first();
   if(!belongs)return error('No tienes acceso a ese grupo.',403);
   const code=random(12).toUpperCase().replaceAll('-','A').replaceAll('_','B');
   const updated=await env.DB.prepare('UPDATE classes SET join_code_hash=? WHERE id=? AND teacher_id=? AND active=1')
     .bind(await digest(code),id,user.id).run();
   if(updated.meta?.changes!==1)return error('No se pudo renovar el código.',409);
   return response({ok:true,code,message:'Código renovado. Los estudiantes y su progreso se conservan.'});
  }
  if(body.action!=='create')return error('Acción inválida.');
  const name=typeof body.name==='string'?body.name.trim():'';
  if(name.length<3||name.length>60)return error('El nombre debe tener entre 3 y 60 caracteres.');
  const cnt=await env.DB.prepare('SELECT COUNT(*) AS total FROM classes WHERE teacher_id=?').bind(user.id).first();
  if(cnt.total>=20)return error('Límite de 20 clases alcanzado.',403);
  const code=random(12).toUpperCase().replaceAll('-','A').replaceAll('_','B');
  const id=crypto.randomUUID();
  await env.DB.prepare('INSERT INTO classes(id,teacher_id,name,join_code_hash,created_at) VALUES (?,?,?,?,?)')
   .bind(id,user.id,name,await digest(code),now()).run();
  return response({ok:true,code,class:{id,name,students:0,active:1}},201);
 }catch{return error('No se pudo crear la clase. Revisa D1.',503)}
}
