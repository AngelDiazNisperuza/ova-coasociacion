import {response,error,dbReady,validOrigin,input,activeUser,isAdministrator,now} from '../_lib/security.js';
const ACTIVITY='reto-agua-01';
function clean(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 const radio=data.radio && typeof data.radio==='object'?data.radio:{};
 const fields=data.fields && typeof data.fields==='object'?data.fields:{};
 const rubric=data.rubric && typeof data.rubric==='object'?data.rubric:{};
 const allowable=['','a','b','c'];
 const levels=['','inicial','proceso','logrado'];
 const out={
  radio:{q1:allowable.includes(radio.q1)?radio.q1:'',q2:allowable.includes(radio.q2)?radio.q2:''},
  fields:{},
  rubric:{}
 };
 for(const id of ['evidencia','dialogo','propuesta']){
  const value=fields[id];
  out.fields[id]=typeof value==='string'?value.slice(0,1300):'';
 }
 for(let i=0;i<4;i++){
  const v=rubric['skill-'+i];
  out.rubric['skill-'+i]=levels.includes(v)?v:'';
 }
 return out;
}
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta D1.',503);
 try{
  const user=await activeUser(env,request);
  if(!user)return error('Inicia sesión para recuperar el progreso.',401);
  if(await isAdministrator(env,user))return error('El Centro de Gestión no realiza actividades.',403);
  const row=await env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?').bind(user.id,ACTIVITY).first();
  return response({ok:true,progress:row?JSON.parse(row.data):null,updatedAt:row?.updated_at??null});
 }catch{return error('El almacenamiento del progreso todavía necesita inicializarse.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta D1.',503);
 try{
  const user=await activeUser(env,request);
  if(!user)return error('Inicia sesión para guardar.',401);
  if(await isAdministrator(env,user))return error('El Centro de Gestión no realiza actividades.',403);
  const body=await input(request);
  const cleanData=clean(body.progress);
  if(!cleanData)return error('Progreso incorrecto.');
  const data=JSON.stringify(cleanData);
  if(data.length>8000)return error('Respuestas demasiado largas.');
  await env.DB.prepare('INSERT INTO activity_progress(user_id,activity_id,data,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,activity_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at')
   .bind(user.id,ACTIVITY,data,now()).run();
  return response({ok:true,updatedAt:now()});
 }catch{return error('No se pudo guardar; revisa la migración de D1.',503)}
}
