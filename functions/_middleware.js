import {activeUser,isAdministrator,dbReady} from './_lib/security.js';
// Restringir contenido del aula y el panel; nunca confiar solo en mostrar/ocultar con CSS.
export async function onRequest(context){
 const url=new URL(context.request.url);
 const protectedPath=url.pathname==='/aula'||url.pathname==='/aula/'||url.pathname==='/aula.html'
  ||url.pathname==='/panel'||url.pathname==='/panel/'||url.pathname==='/panel.html'
  ||url.pathname.startsWith('/contenido/')
  ||/^\/lectura-(unidad|actividades|retos|recursos|progreso)\.html$/.test(url.pathname);
 if(!protectedPath)return context.next();
 if(!['GET','HEAD'].includes(context.request.method))return new Response('Método no admitido',{status:405});
 if(!dbReady(context.env))return Response.redirect(new URL('/acceso.html',url),302);
 try{
  const user=await activeUser(context.env,context.request);
  if(!user)return Response.redirect(new URL('/acceso.html',url),302);
  if((url.pathname.startsWith('/aula')||url.pathname.startsWith('/contenido/'))&&await isAdministrator(context.env,user))return Response.redirect(new URL('/panel.html',url),302);
  const result=await context.next();
  const copy=new Response(result.body,result);
  copy.headers.set('Cache-Control','private, no-store');
  copy.headers.set('X-Content-Type-Options','nosniff');
  return copy;
 }catch{return Response.redirect(new URL('/acceso.html',url),302)}
}
