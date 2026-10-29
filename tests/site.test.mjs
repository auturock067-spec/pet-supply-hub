import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {products,categories} from '../public/catalog.js';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,js,css,robots,headers]=await Promise.all(['public/index.html','public/app.js','public/styles.css','public/robots.txt','public/_headers'].map(read));
test('six independently illustrated product references with unique categories',async()=>{
 assert.equal(products.length,6);assert.equal(categories.length,6);
 assert.equal(new Set(products.map(p=>p.id)).size,6);
 assert.equal(new Set(products.map(p=>p.category)).size,6);
 for(const p of products){
  assert.ok(categories.some(x=>x.id===p.category));
  assert.ok(p.en&&p.zh&&p.summary.length===2&&p.focus.length===2&&p.caution.length===2);
  const artwork=await read('public/assets/'+p.id+'.svg');
  assert.match(artwork,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" /);
  assert.match(artwork,/<\/svg>/);
  assert.doesNotMatch(artwork,/<script|<foreignObject|<image\b|(?:href|src)=["']https?:/i);
 }
});
test('local-only bilingual sourcing form and search controls',()=>{
 assert.match(html,/id="product-grid"/);assert.match(html,/id="filters"/);assert.match(html,/id="product-search"/);
 assert.match(html,/id="rfq-form" novalidate/);assert.match(html,/name="quantity"/);
 assert.match(html,/id="download"/);assert.match(html,/id="language-toggle"/);
 assert.match(js,/encodeURIComponent|navigator\.clipboard\.writeText|new Blob/);
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket/);
 assert.match(js,/lang==='zh'/);
 assert.match(css,/@media\(max-width:550px\)/);
});
test('trust and draft-only safety guards',()=>{
 assert.match(html,/noindex,nofollow/);assert.match(robots,/Disallow:\s*\//);
 assert.match(headers,/form-action 'none'/);assert.match(headers,/X-Content-Type-Options/);
 assert.match(html,/not a shop or verified supplier directory/i);
 assert.match(html,/Food, medicine and veterinary devices are outside/);
 assert.doesNotMatch(html,/action="https?:/);
});
