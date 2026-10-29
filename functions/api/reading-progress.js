import {response,error,dbReady,validOrigin,input,activeUser,isAdministrator,now} from '../_lib/security.js';
// Identificador independiente de la primera unidad del agua.
const ACTIVITY='lectura-critica-11-v1';
const isObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>=0&&v<=100000;
function clean(data){
 if(!isObj(data))return null;
 const out={
  points:count(data.points)?data.points:0,
  streak:count(data.streak)?data.streak:0,
  best:count(data.best)?data.best:0,
  rounds:count(data.rounds)?data.rounds:0,
  correct:{A1:0,A2:0,A3:0},cases:{},retos:{},badges:[],refl:{}
 };
 for(const key of ['A1','A2','A3']){
  if(count(data.correct?.[key]))out.correct[key]=data.correct[key];
 }
 const validBadges=new Set(['lector','arquitecto','critica','emparejador','racha','detective','retador','integral']);
 if(Array.isArray(data.badges))out.badges=[...new Set(data.badges.filter(x=>validBadges.has(x)))];
 for(const c of ['c1','c2','c3','c4']){
  const answers=data.cases?.[c];
  if(isObj(answers)){
   out.cases[c]={};
   for(let q=0;q<3;q++){
    const answer=answers[String(q)];
    if(Number.isSafeInteger(answer)&&answer>=0&&answer<=3)out.cases[c][q]=answer;
   }
  }
  const reflection=data.refl?.[c];
  if(typeof reflection==='string')out.refl[c]=reflection.slice(0,650);
 }
 for(const r of ['r1','r2','r3']){
  const steps=data.retos?.[r];
  if(!isObj(steps))continue;
  out.retos[r]={};
  for(const [k,v] of Object.entries(steps)){
   if(/^[0-2]-[0-9]$/.test(k)&&typeof v==='boolean')out.retos[r][k]=v;
  }
 }
 return out;
}
export async function onRequestGet({request,env}){
 if(!dbReady(env))return error('Falta conectar la base de datos D1.',503);
 try{
  const user=await activeUser(env,request);
  if(!user)return error('Inicia sesión.',401);
  if(await isAdministrator(env,user))return error('Acceso reservado a estudiantes y docentes.',403);
  const row=await env.DB.prepare('SELECT data,updated_at FROM activity_progress WHERE user_id=? AND activity_id=?').bind(user.id,ACTIVITY).first();
  return response({ok:true,progress:row?clean(JSON.parse(row.data)):null,updatedAt:row?.updated_at??null});
 }catch{return error('No se pudo recuperar el progreso lector.',503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return error('Origen no autorizado.',403);
 if(!dbReady(env))return error('Falta conectar la base de datos D1.',503);
 try{
  const user=await activeUser(env,request);
  if(!user)return error('Inicia sesión.',401);
  if(await isAdministrator(env,user))return error('Acceso reservado a estudiantes y docentes.',403);
  const body=await input(request),progress=clean(body.progress);
  if(!progress)return error('Información de progreso incorrecta.');
  const value=JSON.stringify(progress);
  if(value.length>7500)return error('Demasiados datos en el avance.');
  const time=now();
  await env.DB.prepare('INSERT INTO activity_progress(user_id,activity_id,data,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id,activity_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at')
   .bind(user.id,ACTIVITY,value,time).run();
  return response({ok:true,updatedAt:time});
 }catch{return error('No se pudo guardar el progreso lector.',503)}
}