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
