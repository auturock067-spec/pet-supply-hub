import {categories,products,getProduct} from './catalog.js';
const $=selector=>document.querySelector(selector);
const tr=(en,zh)=>lang==='zh'?zh:en;
const local=i=>Array.isArray(i)?i[lang==='zh'?1:0]:i;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ui={
  langToggle:$('#language-toggle'),search:$('#product-search'),filters:$('#filters'),
  grid:$('#product-grid'),results:$('#results'),empty:$('#empty'),
  rfq:$('#rfq-form'),product:$('#rfq-product'),out:$('#rfq-output'),
  rfqStatus:$('#rfq-status'),copy:$('#copy'),download:$('#download')
};
let lang='en';
let filter='all';
let brief='';
function translateStatic(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  for(const element of document.querySelectorAll('[data-en][data-zh]')){
    element.textContent=element.getAttribute(lang==='zh'?'data-zh':'data-en');
  }
  ui.langToggle.textContent=lang==='zh'?'English':'中文';
  ui.langToggle.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
  ui.search.placeholder=tr('Search category, material or specification…','搜索品类、材料或规格……');
  ui.search.setAttribute('aria-label',tr('Search product references','搜索产品参考'));
  ui.filters.setAttribute('aria-label',tr('Filter products','筛选产品'));
  for(const [selector,en,zh] of [['.hero-visual img','Illustration of a washable pet bed','可清洗宠物窝垫示意图'],
    ['.guide:nth-child(1) img','Illustration of collar and leash','项圈与牵引绳示意图'],
    ['.guide:nth-child(2) img','Illustration of pet feeding bowls','宠物食盆示意图'],
    ['.guide:nth-child(3) img','Illustration of pet carrier','宠物携带箱示意图']]){
    $(selector)?.setAttribute('alt',tr(en,zh));
  }
  for(const input of ui.rfq.querySelectorAll('input[placeholder],textarea[placeholder]')){
    const map={size:['e.g. 45 × 35 cm','例如 45 × 35 厘米'],material:['e.g. stainless steel grade to confirm','例如不锈钢，牌号待确认'],
      quantity:['e.g. 300','例如 300'],market:['e.g. Canada','例如加拿大'],notes:['Sample policy, model/lot details, testing documents…','样品政策、型号或批次信息、检测文件……']};
    if(map[input.name])input.placeholder=local(map[input.name]);
  }
  for(const option of ui.rfq.querySelectorAll('option[data-en][data-zh]')) option.textContent=option.getAttribute(lang==='zh'?'data-zh':'data-en');
  if(brief) ui.rfqStatus.textContent=tr('Previous brief is available. Regenerate after editing.','上次清单仍可查看；修改后请重新生成。');
  renderFilters();renderProducts();populateProductSelect();
}
function renderFilters(){
  const items=[{id:'all',en:'All products',zh:'全部产品'},...categories];
  ui.filters.replaceChildren(...items.map(c=>{
    const button=document.createElement('button');
    button.type='button';button.className='chip';
    button.textContent=lang==='zh'?c.zh:c.en;
    button.dataset.filter=c.id;
    button.setAttribute('aria-pressed',String(c.id===filter));
    button.addEventListener('click',()=>{filter=c.id;renderFilters();renderProducts()});
    return button;
  }));
}
function searchText(product){
  const category=categories.find(c=>c.id===product.category);
  return [product.en,product.zh,category.en,category.zh,...product.summary,...product.focus,...product.tags]
    .join(' ').toLocaleLowerCase();
}
function renderProducts(){
  const term=ui.search.value.trim().toLocaleLowerCase();
  const matches=products.filter(p=>(filter==='all'||p.category===filter)&&searchText(p).includes(term));
  ui.grid.innerHTML=matches.map((p)=>{
    const category=categories.find(c=>c.id===p.category);
    return '<article class="product-card" data-product="'+escapeHTML(p.id)+'">'+
      '<div class="product-image"><img src="./assets/'+escapeHTML(p.id)+'.svg" alt="'+escapeHTML(tr(p.en,p.zh))+'" width="800" height="480" loading="lazy" decoding="async"></div>'+
      '<div class="product-info"><small class="product-label">'+escapeHTML(tr(category.en,category.zh))+'</small>'+
      '<h3>'+escapeHTML(tr(p.en,p.zh))+'</h3>'+
      '<p>'+escapeHTML(local(p.summary))+'</p>'+
      '<div class="product-focus"><b>'+tr('Specification focus','规格关注')+'</b><span>'+escapeHTML(local(p.focus))+'</span></div>'+
      '<p class="product-caution">'+escapeHTML(local(p.caution))+'</p>'+
      '<button class="text-action" type="button" data-pick="'+escapeHTML(p.id)+'">'+tr('Use in RFQ →','添加至询价清单 →')+'</button></div></article>';
  }).join('');
  ui.empty.hidden=matches.length!==0;
  ui.results.textContent=tr(matches.length+' product '+(matches.length===1?'reference':'references')+' shown','显示 '+matches.length+' 项产品参考');
  for(const button of ui.grid.querySelectorAll('[data-pick]'))button.addEventListener('click',()=>{
    ui.product.value=button.dataset.pick;
    $('#rfq').scrollIntoView({behavior:'smooth',block:'start'});
    ui.product.focus({preventScroll:true});
  });
}
function populateProductSelect(){
  const value=ui.product.value;
  ui.product.querySelectorAll('option:not([value=""])').forEach(x=>x.remove());
  for(const p of products){
    const option=document.createElement('option');option.value=p.id;option.textContent=tr(p.en,p.zh);
    ui.product.append(option);
  }
  if(value && getProduct(value))ui.product.value=value;
}
function setLang(value,save){
  lang=value==='zh'?'zh':'en';translateStatic();
  if(save){
    try{localStorage.setItem('petsupply-language',lang)}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);
  }
}
function readForm(){
  const fields=['product','animal','size','material','quantity','market','notes'];
  const out={};for(const key of fields)out[key]=String(ui.rfq.elements.namedItem(key)?.value??'').trim();
  return out;
}
function validate(d){
  const problems=[];
  for(const key of ['product','animal','size','material','quantity','market'])if(!d[key])problems.push(key);
  if(d.product&&!getProduct(d.product))problems.push('product');
  if(d.quantity&&!/^[1-9]\d*$/.test(d.quantity))problems.push('quantity');
  if(d.quantity&&Number(d.quantity)>1000000)problems.push('quantity');
  for(const key of ['size','material','market'])if(d[key]?.length>140)problems.push(key);
  const invalid=new Set(problems);
  for(const key of ['product','animal','size','material','quantity','market'])ui.rfq.elements.namedItem(key)?.setAttribute('aria-invalid',String(invalid.has(key)));
  return [...invalid];
}
function buildBrief(d){
  const p=getProduct(d.product);
  const animal={dog:['Dog','犬'],cat:['Cat','猫'],other:['Other (detail in notes)','其他（见备注）']}[d.animal]||[d.animal,d.animal];
  const line=(k,a,b)=>[k+': '+a,k+'：'+b];
  const en=[
    'PETSUPPLYHUB — BUYER SOURCING BRIEF',
    'Draft prepared locally. Not sent, quoted, endorsed or certified.',
    'Product: '+p.en,'Animal / species: '+animal[0],
    'Size / dimensions: '+d.size,'Material / construction: '+d.material,
    'Quantity: '+d.quantity+' pcs','Destination market: '+d.market,
    'Notes: '+(d.notes||'To confirm with manufacturer'),
    'Supplier questions: '+p.focus[0],
    'Risk reminder: '+p.caution[0],
    'Confirm exact model, construction, tests and destination regulations before buying.'
  ];
  const zh=[
    'PETSUPPLYHUB — 采购需求核对清单',
    '此清单仅在浏览器本地生成，并未发送、报价、背书或认证。',
    '产品：'+p.zh,'适用宠物：'+animal[1],
    '尺寸或规格：'+d.size,'材料与结构：'+d.material,
    '数量：'+d.quantity+' 件','目标市场：'+d.market,
    '备注：'+(d.notes||'待与制造商确认'),
    '需向供应商核实：'+p.focus[1],
    '风险提示：'+p.caution[1],
    '采购前须核实准确型号、结构、检测文件及目的地法规。'
  ];
  return en.join('\n')+'\n\n'+'='.repeat(42)+'\n\n'+zh.join('\n');
}
ui.rfq.addEventListener('submit',event=>{
  event.preventDefault();
  const data=readForm(),invalid=validate(data);
  if(invalid.length){
    const labels={product:['product type','产品类型'],animal:['animal','宠物类型'],size:['size','尺寸'],material:['material','材料'],quantity:['quantity','数量'],market:['destination','目标市场']};
    ui.rfqStatus.textContent=tr('Please complete or correct: ','请补全或更正：')+invalid.map(k=>local(labels[k])).join(tr(', ','、'));
    ui.out.hidden=true;brief='';ui.copy.disabled=ui.download.disabled=true;
    ui.rfq.elements.namedItem(invalid[0])?.focus();return;
  }
  brief=buildBrief(data);ui.out.textContent=brief;ui.out.hidden=false;
  ui.copy.disabled=ui.download.disabled=false;
  ui.rfqStatus.textContent=tr('Brief created locally. Nothing was submitted.','本地生成完成，未提交任何数据。');
});
ui.copy.addEventListener('click',async()=>{
  if(!brief)return;
  try{await navigator.clipboard.writeText(brief);ui.rfqStatus.textContent=tr('Copied. No data sent.','已复制，没有发送数据。')}
  catch{ui.rfqStatus.textContent=tr('Clipboard unavailable. Select the brief below to copy manually.','剪贴板不可用，请手动选中下方清单并复制。')}
});
ui.download.addEventListener('click',()=>{
  if(!brief)return;
  const blob=new Blob(['\uFEFF',brief],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='petsupplyhub-bilingual-rfq.txt';a.hidden=true;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  ui.rfqStatus.textContent=tr('Text file prepared. Nothing was submitted.','文本已生成，未提交任何数据。');
});
ui.search.addEventListener('input',renderProducts);
ui.langToggle.addEventListener('click',()=>setLang(lang==='en'?'zh':'en',true));
let preferred='en';try{preferred=localStorage.getItem('petsupply-language')||'en'}catch{}
const requested=new URL(location.href).searchParams.get('lang');
setLang(requested==='zh'||requested==='en'?requested:preferred,false);
