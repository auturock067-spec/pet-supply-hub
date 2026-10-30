import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
const out=new URL('../dist/',import.meta.url);
await rm(out,{force:true,recursive:true});await mkdir(out,{recursive:true});await cp(new URL('../public/',import.meta.url),out,{recursive:true});
await writeFile(new URL('build-info.json',out),JSON.stringify({project:'pet-supply-hub',version:'0.1.0',stage:'draft-preview',reviewed:'2026-10-29',commit:process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||'local'},null,2));
console.log('Built PetSupplyHub: static draft preview, no external services.');
