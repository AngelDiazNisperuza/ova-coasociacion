import {response,error,dbReady,validOrigin,input,activeUser,isAdministrator,digest,random,now} from '../_lib/security.js';

// Solo el primer docente registrado gestiona las invitaciones de nuevos docentes.
export async function onRequestPost({request,env}){
 if(!dbReady(env))return error('Falta D1.',503);
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 try {
  const user=await activeUser(env,request);
  if(!await isAdministrator(env,user))return error('Solo Centro de Gestión puede invitar a docentes.',403);
  const data=await input(request);
  if(data.action!=='create')return error('Acción no reconocida.');
  const quota=await env.DB.prepare('SELECT COUNT(*) AS total FROM teacher_invites WHERE created_by=? AND used_at IS NULL AND expires_at>?')
    .bind(user.id,now()).first();
  if(quota.total>=30)return error('Límite de invitaciones pendientes alcanzado.',403);
  const code=random(18); // 24 caracteres de alta entropía; se muestra una sola vez
  const id=crypto.randomUUID();
  const expiresAt=now()+72*3600;
  await env.DB.prepare('INSERT INTO teacher_invites(id,code_hash,created_by,expires_at,created_at) VALUES (?,?,?,?,?)')
    .bind(id,await digest(code),user.id,expiresAt,now()).run();
  return response({ok:true,code,expiresAt,message:'Comparte este código de invitación únicamente con el docente destinatario.'},201);
 }catch{return error('Para invitar docentes debes crear la tabla teacher_invites en D1.',503)}
}
