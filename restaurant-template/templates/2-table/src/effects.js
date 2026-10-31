import { animate, press, inView, scroll, stagger } from 'motion';

const ease = [0.2, 0.7, 0.2, 1];
const spring = d => ({ type: 'spring', bounce: 0, visualDuration: d });
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// 1. Nom du hero, lettre par lettre
function heroName() {
  const word = $('h1 span');
  if (!word) return;
  const text = word.textContent;
  word.textContent = '';
  word.setAttribute('aria-hidden', 'true');
  for (const ch of text) {
    const s = document.createElement('span');
    s.className = 'l';
    s.textContent = ch;
    word.appendChild(s);
  }
  animate('.l', { opacity: [0, 1], y: ['45%', '0%'], filter: ['blur(12px)', 'blur(0px)'] },
    { duration: 1, ease, delay: stagger(0.07, { startDelay: 0.1 }) });
  animate('.facts, .addr', { opacity: [0, 1], y: [14, 0] }, { duration: 0.9, ease, delay: stagger(0.12, { startDelay: 0.9 }) });
}

// 3. Le nom s'éloigne vers la gauche quand on quitte le hero
function heroDrift() {
  const hero = $('.hero'), h1 = $('h1');
  if (!hero || !h1) return;
  scroll(animate(h1, { x: ['0%', '-14%'], opacity: [1, 0.1] }, { ease: 'linear' }),
    { target: hero, offset: ['start start', 'end start'] });
}

// 4. Menu : chaque plat se pose, un filet suit la progression
function menu() {
  inView('.courses li', el => {
    if (el.dataset.in) return;
    el.dataset.in = '1';
    animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.8, ease });
    animate($('.n', el), { x: [-24, 0] }, { duration: 0.9, ease });
  }, { amount: 0.3 });

  const list = $('.courses');
  if (!list) return;
  const rail = document.createElement('span');
  rail.className = 'rail';
  rail.setAttribute('aria-hidden', 'true');
  list.appendChild(rail);
  scroll(animate(rail, { scaleY: [0, 1] }, { ease: 'linear' }),
    { target: list, offset: ['start 75%', 'end 60%'] });
}

// 5. Réservation : retour d'interaction
function booking() {
  press('a.link, button[type=submit]', el => {
    animate(el, { scale: 0.97 }, spring(0.15));
    return () => animate(el, { scale: 1 }, spring(0.3));
  });

  // Les choix sont des <span> dans des <label> : pas de press() (il les rendrait focusables)
  const sel = '.days label span, .choices label span';
  let pressed = null;
  document.addEventListener('pointerdown', e => {
    const s = e.target.closest(sel);
    if (!s) return;
    pressed = s;
    animate(s, { scale: 0.94 }, spring(0.15));
  });
  const release = () => { if (pressed) { animate(pressed, { scale: 1 }, spring(0.3)); pressed = null; } };
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);

  // Le récapitulatif et les messages se renouvellent quand leur texte change
  ['recap', 'msg'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      if (el.textContent) animate(el, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3, ease });
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });
}

// 2. Curseur personnalisé (souris précise uniquement)
function cursor() {
  if (!fine) return;
  const RED = '#d4472b', INK = '#e9e3d6', BG = '#0f0e0c';
  const cur = document.createElement('div');
  cur.className = 'cur';
  cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<i class="dot"></i><b class="txt"></b>';
  document.body.appendChild(cur);
  const dot = cur.firstChild, txt = cur.lastChild;
  document.documentElement.classList.add('has-cursor');

  $$('.courses li').forEach((li, i, all) => {
    li.dataset.cursor = String(i + 1).padStart(2, '0') + ' / ' + String(all.length).padStart(2, '0');
  });

  const states = {
    base: [1, 1, RED, '', BG],
    ring: [3.4, 0.28, RED, '', BG],
    hidden: [0, 0, RED, '', BG]
  };
  let key = 'base', scale = 1;
  function go(k, label) {
    const s = states[k] || (k === 'cta' ? [5.6, 1, RED, label, INK] : [6, 1, INK, label, BG]);
    scale = s[0];
    animate(dot, { scale: s[0], opacity: s[1], backgroundColor: s[2] }, spring(0.3));
    txt.textContent = s[3];
    txt.style.color = s[4];
    animate(txt, { opacity: s[3] ? 1 : 0 }, { duration: 0.15 });
  }

  function pick(t) {
    if (t.closest('.fields')) return ['hidden'];
    const c = t.closest('[data-cursor]');
    if (c) return [c.matches('.courses li') ? 'row' : 'cta', c.dataset.cursor];
    if (t.closest('a[href], button, .days label, .choices label')) return ['ring'];
    return ['base'];
  }

  let shown = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (!shown) {
      shown = true;
      animate(cur, { x: e.clientX, y: e.clientY }, { duration: 0 });
      animate(cur, { opacity: 1 }, { duration: 0.2 });
    } else {
      animate(cur, { x: e.clientX, y: e.clientY }, spring(0.18));
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { shown = false; animate(cur, { opacity: 0 }, { duration: 0.2 }); });

  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const [k, label] = pick(e.target);
    const id = k + (label || '');
    if (id === key) return;
    key = id;
    go(k, label);
  });
  document.addEventListener('pointerdown', () => animate(dot, { scale: scale * 0.85 }, spring(0.12)));
  document.addEventListener('pointerup', () => animate(dot, { scale }, spring(0.25)));
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.__fx = true;
  heroName();
  heroDrift();
  menu();
  booking();
  cursor();
}
