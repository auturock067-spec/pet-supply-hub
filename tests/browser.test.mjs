import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createStaticServer} from '../scripts/serve.mjs';
import {products,categories} from '../public/catalog.js';
import {site} from '../public/site.js';
const isHair=site.kind==='hair',widths=[320,390,768,1440];
async function fill(page){
 await page.selectOption('#rfq-product',products[1].id);
 if(isHair){await page.selectOption('[name=fiber]','human');await page.selectOption('[name=unit]','sets');}
 else await page.selectOption('[name=animal]','dog');
 await page.fill('[name=size]',isHair?'Base 12 x 8 cm; stretched length 40 cm; shade swatch to approve':'60 x 40 cm');
 await page.fill('[name=material]',isHair?'Human hair declaration to verify, cap construction/weight to agree':'Polyester removable cover; filling and care to confirm');
 await page.fill('[name=quantity]','120');await page.fill('[name=market]','Canada');
 await page.fill('[name=packaging]','Individual packs; English/French label artwork to review');await page.fill('[name=delivery]','Toronto; sample first; delivery timing and Incoterms to agree');
 await page.fill('[name=email]','buyer@example.com');await page.fill('[name=notes]','Model/lot-specific evidence and sample acceptance criteria to agree.');
}
test('V0.1 bilingual browser acceptance',async t=>{
 const server=createStaticServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=process.env.TEST_BASE_URL||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});await mkdir('artifacts',{recursive:true});let cases=0,scans=0;
 try{
  for(const width of widths)for(const language of ['en','zh'])await t.test(`${width}px ${language}: images, navigation, search, RFQ and export`,async()=>{
   const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true,reducedMotion:'reduce'});const page=await context.newPage(),errors=[],outbound=[];
   page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>{if(r.url().startsWith('http')&&!r.url().startsWith(base))outbound.push(r.url());});
   try{
    const response=await page.goto(base+'/?lang='+language);assert.equal(response.status(),200);assert.equal(await page.locator('html').getAttribute('lang'),language==='zh'?'zh-CN':'en');assert.equal(await page.title(),site.title[language==='zh'?1:0]);
    assert.equal(await page.locator('.product-card').count(),6);await page.locator('.product-card img').evaluateAll(async els=>Promise.all(els.map(el=>{el.loading='eager';return el.decode();})));
    const images=await page.locator('.product-card img').evaluateAll(els=>els.map(e=>({width:e.naturalWidth,height:e.naturalHeight,alt:e.alt})));assert.ok(images.every(x=>x.width===800&&x.height===480&&x.alt));
    const broken=await page.locator('a[href^="#"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1))));assert.deepEqual(broken,[]);
    await page.fill('#product-search',products[2].zh);assert.equal(await page.locator('.product-card').count(),1);await page.fill('#product-search','');await page.locator(`button[data-filter="${categories[3].id}"]`).click();assert.equal(await page.locator('.product-card').count(),1);await page.locator('button[data-filter=all]').click();
    await page.fill('#product-search','nonesuch___');assert.equal(await page.locator('.product-card').count(),0);assert.ok(await page.locator('#empty').isVisible());await page.fill('#product-search','');
    for(const p of products){await page.locator(`button[data-pick="${p.id}"]`).click();assert.equal(await page.locator('#rfq-product').inputValue(),p.id);}
    await page.locator('#rfq-form button[type=submit]').click();assert.ok(await page.locator('#rfq-output').isHidden());assert.equal(await page.locator('#download').isEnabled(),false);
    await fill(page);await page.locator('#rfq-form button[type=submit]').click();const brief=await page.locator('#rfq-output').innerText();assert.ok(brief.includes(products[1].en)&&brief.includes(products[1].zh)&&brief.includes('buyer@example.com')&&brief.includes('120')&&brief.includes('Toronto'));
    const pending=page.waitForEvent('download');await page.locator('#download').click();const download=await pending;assert.equal(download.suggestedFilename(),site.download);const file=await readFile(await download.path(),'utf8');assert.ok(file.includes(products[1].zh)&&file.includes('buyer@example.com'));
    await context.grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#copy').click();assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),brief.replace(/\r\n/g,'\n'));
    await page.fill('[name=notes]','Updated acceptance requirement');assert.ok(await page.locator('#download').isDisabled());assert.ok(await page.locator('#rfq-output').isHidden());await page.locator('#rfq-form button[type=submit]').click();assert.ok((await page.locator('#rfq-output').innerText()).includes('Updated acceptance requirement'));
    await page.locator('#language-toggle').click();assert.equal(await page.locator('[name=quantity]').inputValue(),'120');assert.equal(await page.locator('html').getAttribute('lang'),language==='zh'?'en':'zh-CN');await page.locator('#language-toggle').click();
    const storage=await page.evaluate(()=>({keys:Object.keys(localStorage),values:Object.values(localStorage),session:sessionStorage.length}));assert.ok(storage.keys.every(k=>k===site.storageKey));assert.ok(storage.values.every(v=>v==='en'||v==='zh'));assert.equal(storage.session,0);
    const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));assert.ok(geometry.scroll<=geometry.client+1,'Overflow: '+JSON.stringify(geometry));
    if(width===390){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);scans++;}
    assert.deepEqual(errors,[]);assert.deepEqual(outbound,[]);await page.screenshot({path:`artifacts/${language}-${width}.png`,fullPage:true});cases++;
   }finally{await context.close();}
  });
  await t.test('invalid quantity/email/whitespace and literal hostile input',async()=>{
   const page=await browser.newPage();try{
    await page.goto(base+'/?lang=en');await fill(page);
    for(const quantity of ['0','-1','1000001','1.5']){await page.fill('[name=quantity]',quantity);await page.locator('#rfq-form button[type=submit]').click();assert.ok(await page.locator('#rfq-output').isHidden());}
    if(isHair){await page.selectOption('[name=unit]','kg');await page.fill('[name=quantity]','0.5');await page.locator('#rfq-form button[type=submit]').click();assert.ok(await page.locator('#rfq-output').isVisible());await page.selectOption('[name=unit]','pieces');}
    await page.fill('[name=quantity]','20');await page.fill('[name=email]','invalid-email');await page.locator('#rfq-form button[type=submit]').click();assert.ok(await page.locator('#rfq-output').isHidden());
    await page.fill('[name=email]','buyer@example.com');await page.fill('[name=size]','   ');await page.locator('#rfq-form button[type=submit]').click();assert.ok(await page.locator('#rfq-output').isHidden());
    await page.fill('[name=size]','<img src=x onerror=alert(1)>');await page.locator('#rfq-form button[type=submit]').click();assert.ok((await page.locator('#rfq-output').innerText()).includes('<img src=x'));assert.equal(await page.locator('img[src=x]').count(),0);
   }finally{await page.close();}
  });
  await t.test('denied clipboard selects the current brief for manual copy',async()=>{
   const page=await browser.newPage();await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied in acceptance simulation');}}}));
   try{await page.goto(base+'/?lang=en');await fill(page);await page.locator('#rfq-form button[type=submit]').click();await page.locator('#copy').click();assert.match(await page.locator('#rfq-status').innerText(),/Clipboard unavailable/);assert.ok((await page.evaluate(()=>getSelection().toString())).includes('buyer@example.com'));}finally{await page.close();}
  });
  await t.test('actual HTTP headers, privacy and noindex guard',async()=>{
   const context=await browser.newContext(),page=await context.newPage();try{const response=await page.goto(base+'/');assert.ok(response.headers()['content-security-policy'].includes("connect-src 'none'"));assert.equal(response.headers()['x-content-type-options'],'nosniff');assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');assert.ok((await(await context.request.get(base+'/robots.txt')).text()).includes('Disallow: /'));assert.equal((await context.request.get(base+'/not-a-page')).status(),404);}finally{await context.close();}
  });
  if(cases===8&&scans===2)await writeFile('artifacts/acceptance.json',JSON.stringify({project:site.brand,date:new Date().toISOString(),viewportCases:cases,widths,languages:['en','zh'],accessibilityScans:scans,coreRegressionCases:3,allPassed:true,remote:process.env.TEST_BASE_URL||null},null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
});
