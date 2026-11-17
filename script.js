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
  });
});
const lightbox = document.querySelector('.lightbox');
const photo = lightbox.querySelector('img');
const close = lightbox.querySelector('button');
let trigger;
function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.querySelector('main').inert = false;
  document.querySelector('header').inert = false;
  document.querySelector('footer').inert = false;
  document.body.style.overflow = '';
  photo.removeAttribute('src');
  trigger?.focus();
}
document.querySelectorAll('[data-img]').forEach(button => button.addEventListener('click', () => {
  trigger = button;
  photo.src = button.dataset.img;
  photo.alt = button.querySelector('img')?.alt || 'Portfolio sample';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.querySelector('main').inert = true;
  document.querySelector('header').inert = true;
  document.querySelector('footer').inert = true;
  document.body.style.overflow = 'hidden';
  close.focus();
}));
close.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('active')) closeLightbox();
    else { setMenu(false); if (mobile.matches) menu.focus(); }
  }
  if (e.key === 'Tab' && lightbox.classList.contains('active')) { e.preventDefault(); close.focus(); }
});
