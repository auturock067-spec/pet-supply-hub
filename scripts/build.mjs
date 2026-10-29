import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('../dist/',import.meta.url);
await rm(out,{force:true,recursive:true});
await mkdir(out,{recursive:true});
await cp(new URL('../public/',import.meta.url),out,{recursive:true});
await writeFile(new URL('build-info.txt',out),'PetSupplyHub V0.1\nDraft preview; no production approval.\n');
console.log('Build complete: public/ → dist/. No API, database or third-party assets.');
