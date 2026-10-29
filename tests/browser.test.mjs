import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createStaticServer} from '../scripts/serve.mjs';
const widths=[320,390,768,1440];
test('mobile/desktop English & Chinese, images, live filters and privacy-safe RFQ export',async t=>{
 const server=createStaticServer();
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const port=server.address().port,base='http://127.0.0.1:'+port;
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of widths){
   await t.test(width+'px',async()=>{
    const page=await browser.newPage({viewport:{width,height:900},acceptDownloads:true});
    const errors=[],outbound=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('request',r=>{if(!r.url().startsWith(base))outbound.push(r.url())});
    try{
     const resp=await page.goto(base+'/?lang=en',{waitUntil:'load'});
     assert.equal(resp.status(),200);
     const img=page.locator('.product-card img');assert.equal(await img.count(),6);
     const states=await img.evaluateAll(async els=>Promise.all(els.map(async el=>{
      el.loading='eager';
      await Promise.race([el.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('decode timeout')),7000))]);
      return {w:el.naturalWidth,h:el.naturalHeight,alt:el.alt};
     })));
     assert.ok(states.every(s=>s.w===800&&s.h===480&&s.alt),JSON.stringify(states));
     await page.locator('#product-search').fill('不锈钢');
     assert.equal(await page.locator('.product-card').count(),1,'Chinese search in English failed');
     await page.locator('#product-search').fill('');
     await page.locator('button[data-filter="feeding"]').click();
     assert.equal(await page.locator('.product-card').count(),1);
     await page.locator('button[data-filter="all"]').click();
     await page.locator('#language-toggle').click();
     assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
     assert.match(await page.locator('h1').innerText(),/采购宠物用品/);
     await page.locator('#product-search').fill('grooming');
     assert.equal(await page.locator('.product-card').count(),1,'English search in Chinese failed');
     await page.locator('#product-search').fill('nonesuch__');
     assert.equal(await page.locator('.product-card').count(),0);
     assert.equal(await page.locator('#empty').isVisible(),true);
     await page.locator('#product-search').fill('');
     await page.locator('#rfq-form button[type=submit]').click();
     assert.match(await page.locator('#rfq-status').innerText(),/请补全或更正/);
     await page.selectOption('#rfq-product','pet-bed');
     await page.selectOption('select[name=animal]','dog');
     await page.fill('input[name=size]','60 x 40 cm');
     await page.fill('input[name=material]','polyester cover');
     await page.fill('input[name=quantity]','120');
     await page.fill('input[name=market]','Canada');
     await page.fill('textarea[name=notes]','Washable cover, specific report to confirm');
     await page.locator('#rfq-form button[type=submit]').click();
     const out=await page.locator('#rfq-output').innerText();
     assert.ok(out.includes('Washable pet bed')&&out.includes('可清洗宠物窝垫'));
     assert.ok(out.includes('120')&&out.includes('Canada'));
     assert.equal(await page.locator('#download').isEnabled(),true);
     const pending=page.waitForEvent('download');
     await page.locator('#download').click();
     const dl=await pending;assert.equal(dl.suggestedFilename(),'petsupplyhub-bilingual-rfq.txt');
     await page.locator('#language-toggle').click();
     assert.equal(await page.locator('html').getAttribute('lang'),'en');
     assert.equal(await page.locator('input[name=size]').inputValue(),'60 x 40 cm');
     const geometry=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
     assert.ok(geometry.scroll<=geometry.client+1,'Horizontal overflow '+JSON.stringify(geometry));
     assert.deepEqual(errors,[]);assert.deepEqual(outbound,[],'unexpected remote requests');
    }finally{await page.close()}
   });
  }
 }finally{await browser.close();await new Promise(r=>server.close(r))}
});
