import {response,error,now,dbReady,validOrigin,input,userName,passwordOK,digest,hashPassword,verifyPassword,constantCompare,createSession,clearCookie,activeUser,removeSession,isAdministrator} from '../_lib/security.js';

export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('El acceso está pendiente de conexión con D1.',503);
 try{
  const user=await activeUser(env,request);
  const docentes=await env.DB.prepare("SELECT COUNT(*) AS total FROM users WHERE role='docente'").first();
  if(!user)return response({ok:true,user:null,setupAvailable:docentes.total===0});
  const administrator=await isAdministrator(env,user);
  return response({ok:true,user:{username:user.username,role:administrator?'administrador':user.role,coordinator:administrator},setupAvailable:docentes.total===0});
 }catch{return error('Es necesario inicializar la base D1.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta conectar la base D1 en Cloudflare.',503);
 let data;try{data=await input(request)}catch{return error('Solicitud incorrecta.')}
 try{
  if(data.action==='logout'){
   await removeSession(env,request);
   return response({ok:true},200,{'set-cookie':clearCookie()});
  }
  if(data.action==='login'){
   const username=userName(data.username);
   if(!username||typeof data.password!=='string'||!passwordOK(data.password))return error('Usuario o PIN incorrectos.',401);
   const user=await env.DB.prepare('SELECT * FROM users WHERE username=? AND active=1').bind(username).first();
   const valid=user&&await verifyPassword(data.password,user);
   if(!valid)return error('Usuario o PIN incorrectos.',401);
   if(data.role&&data.role!==user.role)return error('La cuenta corresponde a otro perfil. Selecciona Estudiantes o Docentes.',403);
   await removeSession(env,request);
   const session=await createSession(env,user.id);
   return response({ok:true,user:{username:user.username,role:await isAdministrator(env,user)?'administrador':user.role}},200,{'set-cookie':session});
  }
  if(data.action==='register'){
   const username=userName(data.username);
   const code=typeof data.classCode==='string'?data.classCode.toUpperCase().replace(/[^A-Z0-9]/g,''):'';
   if(!username||!passwordOK(data.password)||!/^[A-Z0-9]{16}$/.test(code))return error('Necesitas un seudónimo válido, un PIN de 4 dígitos y un código de clase.');
   const cls=await env.DB.prepare('SELECT c.id FROM classes c JOIN users t ON t.id=c.teacher_id WHERE c.join_code_hash=? AND c.active=1 AND t.active=1 AND c.teacher_id<>(SELECT id FROM users WHERE role=\'docente\' ORDER BY created_at,id LIMIT 1)').bind(await digest(code)).first();
   if(!cls)return error('El código de clase no es válido.',403);
   const existing=await env.DB.prepare('SELECT id FROM users WHERE username=?').bind(username).first();
   if(existing)return error('Ese usuario ya existe.',409);
   const number=await env.DB.prepare('SELECT COUNT(*) AS total FROM users WHERE class_id=?').bind(cls.id).first();
   if(number.total>=50)return error('La clase está completa.',403);
   const record=await hashPassword(data.password),uid=crypto.randomUUID();
   await env.DB.prepare('INSERT INTO users(id,username,role,password_hash,salt,iterations,class_id,created_at) VALUES (?,?,?,?,?,?,?,?)')
    .bind(uid,username,'estudiante',record.hash,record.salt,record.iterations,cls.id,now()).run();
   const session=await createSession(env,uid);
   return response({ok:true,user:{username,role:'estudiante'}},201,{'set-cookie':session});
  }
  if(data.action==='register_teacher'){
   const username=userName(data.username);
   const code=typeof data.inviteCode==='string'?data.inviteCode.trim():'';
   if(!username||!passwordOK(data.password)||!/^[A-Za-z0-9_-]{24}$/.test(code)){
    return error('Se requiere usuario, PIN de cuatro dígitos y una invitación válida.');
   }
   const hash=await digest(code),t=now(),id=crypto.randomUUID();
   const record=await hashPassword(data.password);
   // Dos consultas transaccionales: la inscripción solo ocurre si el código está vigente
   // y sin consumir; después se registra la persona que utilizó la invitación.
   const statements=[
    env.DB.prepare("INSERT INTO users(id,username,role,password_hash,salt,iterations,created_at) SELECT ?,?,'docente',?,?,?,? WHERE EXISTS(SELECT 1 FROM teacher_invites WHERE code_hash=? AND used_at IS NULL AND expires_at>?)")
     .bind(id,username,record.hash,record.salt,record.iterations,t,hash,t),
    env.DB.prepare('UPDATE teacher_invites SET used_at=?,used_by=? WHERE code_hash=? AND used_at IS NULL AND expires_at>? AND EXISTS(SELECT 1 FROM users WHERE id=?)')
     .bind(t,id,hash,t,id)
   ];
   const results=await env.DB.batch(statements);
   if(results?.[0]?.meta?.changes!==1||results?.[1]?.meta?.changes!==1)return error('Invitación inválida, caducada o utilizada.',403);
   const cookie=await createSession(env,id);
   return response({ok:true,user:{username,role:'docente'}},201,{'set-cookie':cookie});
  }
  if(data.action==='setup'){
   const username=userName(data.username);
   if(!username||!passwordOK(data.password,true))return error('Usuario válido y PIN docente de 4 dígitos.');
   const secret=env.ADMIN_SETUP_KEY;
   if(typeof secret!=='string'||secret.length<24)return error('Falta configurar ADMIN_SETUP_KEY en Cloudflare.',503);
   if(!await constantCompare(data.setupKey,secret))return error('Clave de activación incorrecta.',403);
   const userCount=await env.DB.prepare("SELECT COUNT(*) AS total FROM users WHERE role='docente'").first();
   if(userCount.total>0)return error('Ya existe una cuenta docente administradora.',409);
   const record=await hashPassword(data.password),uid=crypto.randomUUID();
   const inserted=await env.DB.prepare("INSERT INTO users(id,username,role,password_hash,salt,iterations,created_at) SELECT ?,?,'docente',?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM users WHERE role='docente')")
    .bind(uid,username,record.hash,record.salt,record.iterations,now()).run();
   if(inserted.meta?.changes!==1)return error('Ya existe una cuenta docente administradora.',409);
   const session=await createSession(env,uid);
   return response({ok:true,user:{username,role:'administrador'}},201,{'set-cookie':session});
  }
  return error('Acción no válida.');
 }catch(e){
  if(String(e?.message).includes('UNIQUE constraint'))return error('El nombre de usuario ya está ocupado.',409);
  return error('La base de datos aún requiere configuración.',503);
 }
}
