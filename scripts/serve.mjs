import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const base=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
export function createStaticServer(){
 return createServer(async(req,res)=>{
  const basePath=new URL(req.url||'/', 'http://localhost').pathname;
  let pathname;
  try{pathname=decodeURIComponent(basePath)}catch{res.writeHead(400);res.end('Bad URL');return}
  const path=resolve(base,'.'+(pathname==='/'?'/index.html':pathname));
  if(path!==base&&!path.startsWith(base+sep)){res.writeHead(403);res.end('Forbidden');return}
  try{
   const s=await stat(path);if(!s.isFile())throw new Error('not file');
   const content=await readFile(path);
   res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream',
    'x-content-type-options':'nosniff',
    'content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; object-src 'none'"});
   res.end(req.method==='HEAD'?undefined:content);
  }catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Not found')}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||4173);
 const server=createStaticServer();
 server.listen(port,'127.0.0.1',()=>console.log('PetSupplyHub on http://127.0.0.1:'+port+'/'));
}
