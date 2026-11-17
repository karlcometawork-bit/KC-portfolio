const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) setMenu(false); });
const mobile = matchMedia('(max-width:980px)');
mobile.addEventListener('change', () => setMenu(false));
const filters = [...document.querySelectorAll('.gallery-filter button')];
const items = [...document.querySelectorAll('.portfolio-item')];
filters.forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    items.forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; });
    const count=items.filter(item=>!item.hidden).length;
    document.querySelector('.gallery-count').textContent = count+' pieces';
  });
});
document.querySelectorAll('[data-chart-mode]').forEach(button => button.addEventListener('click', () => {
  const share=button.dataset.chartMode==='share';
  document.querySelectorAll('[data-chart-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('[data-chart-value="new"]').textContent=share?'44.9%':'162';
  document.querySelector('[data-chart-value="returning"]').textContent=share?'55.1%':'199';
  document.querySelector('[data-chart-context]').textContent=share?'Share of 361 reported engagements, rounded to one decimal place.':'Counts from the CSR activity summary.';
}));
const lightbox=document.querySelector('.lightbox');
const photo=lightbox.querySelector('img');
const caption=document.querySelector('#lightbox-caption');
const position=lightbox.querySelector('.lightbox-position');
const close=lightbox.querySelector('.lightbox-close');
const prev=lightbox.querySelector('.lightbox-prev');
const next=lightbox.querySelector('.lightbox-next');
let trigger, group=[], index=0;
function showArtwork() {
  const button=group[index];
  photo.src=button.dataset.img;
  photo.alt=button.querySelector('img')?.alt || 'Portfolio artwork';
  caption.textContent=button.dataset.caption || photo.alt;
  position.textContent=(index+1)+' / '+group.length;
  prev.disabled=next.disabled=group.length<2;
}
function stepArtwork(direction) { index=(index+direction+group.length)%group.length; showArtwork(); }
function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden','true');
  ['main','header','footer'].forEach(s=>document.querySelector(s).inert=false);
  document.body.style.overflow='';
  photo.removeAttribute('src');
  trigger?.focus();
}
document.querySelectorAll('[data-img]').forEach(button=>button.addEventListener('click',()=>{
  trigger=button;
  group=button.classList.contains('portfolio-item')?items.filter(i=>!i.hidden):[...button.parentElement.querySelectorAll('[data-img]')];
  if(!group.includes(button)) group=[button];
  index=group.indexOf(button);
  showArtwork();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden','false');
  ['main','header','footer'].forEach(s=>document.querySelector(s).inert=true);
  document.body.style.overflow='hidden';
  close.focus();
}));
close.addEventListener('click',closeLightbox);
prev.addEventListener('click',()=>stepArtwork(-1));
next.addEventListener('click',()=>stepArtwork(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(lightbox.classList.contains('active')) closeLightbox();
    else if(menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}
  }
  if(!lightbox.classList.contains('active'))return;
  if(e.key==='ArrowRight'){e.preventDefault();stepArtwork(1);}
  if(e.key==='ArrowLeft'){e.preventDefault();stepArtwork(-1);}
  if(e.key==='Tab'){
    const controls=[...lightbox.querySelectorAll('button:not(:disabled)')];
    const first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});

const wingMetrics={views:{values:[116500,38844,41075],total:'196,419',unit:'recorded views across these 3 office accounts',label:'views'},interactions:{values:[2300,1107,1110],total:'4,517',unit:'recorded interactions across these 3 office accounts',label:'interactions'}};
document.querySelectorAll('[data-wing-metric]').forEach(button=>button.addEventListener('click',()=>{
 const data=wingMetrics[button.dataset.wingMetric],max=Math.max(...data.values);
 document.querySelectorAll('[data-wing-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('[data-wing-total]').textContent=data.total;
 document.querySelector('[data-wing-unit]').textContent=data.unit;
 data.values.forEach((value,i)=>{document.querySelector('[data-wing-value="'+i+'"]').textContent=value.toLocaleString('en-US');document.querySelector('[data-wing-bar="'+i+'"]').style.width=(value/max*100)+'%';});
 document.querySelector('[data-wing-max]').textContent=max.toLocaleString('en-US')+' '+data.label;
 document.querySelector('[data-wing-chart]').setAttribute('aria-label','Instagram baseline '+data.label+': Wetherill Park '+data.values[0]+', Fairfield '+data.values[1]+', Cecil Hills '+data.values[2]+'. Same Aug 23–Sep 21, 2026 window.');
}));
const nextMetrics={
 conversations:{values:[840,472],max:1000,format:v=>v.toLocaleString('en-US'),unit:'recorded conversations · Nov 8–14',note:'Conversation volume fell 43.8% during a shorter delivery window.',label:'recorded conversations'},
 spend:{values:[231.09,120.63],max:250,format:v=>'$'+v.toFixed(2),unit:'recorded spend USD · Nov 8–14',note:'Reported spend fell 47.8%; ads were held from Nov 12.',label:'spend USD'},
 cost:{values:[.275,.256],max:.30,format:v=>'$'+v.toFixed(3),unit:'reported cost per conversation · Nov 8–14',note:'Reported cost/conversation fell 7.1%; this is not a conversion-lift claim.',label:'cost per conversation USD'}
};
document.querySelectorAll('[data-next-metric]').forEach(button=>button.addEventListener('click',()=>{
 const data=nextMetrics[button.dataset.nextMetric];
 document.querySelectorAll('[data-next-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('[data-next-highlight]').textContent=data.format(data.values[1]);
 document.querySelector('[data-next-unit]').textContent=data.unit;
 document.querySelector('[data-next-axis-top]').textContent=data.format(data.max);
 document.querySelector('[data-next-axis-mid]').textContent=data.format(data.max/2);
 data.values.forEach((value,i)=>{document.querySelector('[data-next-value="'+i+'"]').textContent=data.format(value);document.querySelector('[data-next-bar="'+i+'"]').style.height=(value/data.max*100)+'%';});
 document.querySelector('[data-next-note]').textContent=data.note;
 document.querySelector('[data-next-chart]').setAttribute('aria-label',data.label+': Nov 1–7 '+data.format(data.values[0])+', Nov 8–14 '+data.format(data.values[1])+'. Ads held from Nov 12.');
}));
