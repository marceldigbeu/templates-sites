// ---- RÉGLAGES (à adapter au client) ----
const WHATSAPP = '';          // numéro au format international sans + ni espaces, ex : '33612345678'. Vide = mode démo.
const MIN_DELIVERY = 15;      // minimum de commande en livraison (€)
const DELIVERY_FEE = 2;       // frais de livraison (€)
const FREE_DELIVERY_FROM = 25;// livraison offerte à partir de (€)
const MENU_EXTRA = 3;         // supplément « menu » : frites + canette (€)
const OPEN = { 0: [11, 25], 1: [11, 25], 2: [11, 25], 3: [11, 25], 4: [11, 25], 5: [11, 26], 6: [11, 26] }; // heures, au-delà de 24 = après minuit

const MEATS = ['Agneau-veau', 'Poulet', 'Mixte'];
const SAUCES = ['Blanche', 'Harissa', 'Algérienne', 'Samouraï', 'Ketchup', 'Mayonnaise', 'Barbecue'];
const CRUDITES = ['Salade', 'Tomate', 'Oignon', 'Cornichons'];

// kind : 'sandwich' (viande + sauces + crudités + menu), 'plate' (viande + sauces), 'burger' (sauces + crudités + menu), '' (aucun choix)
const MENU = [
  { id: 'sandwichs', title: 'Sandwichs', kind: 'sandwich', items: [
    ['Kebab', 'Pain cuit à la commande, viande, crudités, sauce', 7.5],
    ['Galette', 'Galette, viande, fromage fondu, crudités', 8.5],
    ['Dürüm', 'Galette roulée, viande, crudités, sauce', 8],
    ['Tacos M', 'Une viande, sauce fromagère, frites dedans', 8.5],
    ['Tacos L', 'Deux viandes, double fromage, frites dedans', 10.5]
  ] },
  { id: 'assiettes', title: 'Assiettes', kind: 'plate', items: [
    ['Assiette kebab', 'Viande, frites, salade, sauce', 11.5],
    ['Assiette mixte', 'Agneau-veau et poulet, frites, riz, salade', 13]
  ] },
  { id: 'burgers', title: 'Burgers', kind: 'burger', items: [
    ['Cheese', 'Steak haché halal, cheddar, cornichons', 6.5],
    ['Double', 'Deux steaks, double cheddar, oignons', 8.5],
    ['Chicken', 'Poulet pané, salade, mayonnaise', 7.5]
  ] },
  { id: 'cotes', title: 'À côté', kind: '', items: [
    ['Frites', 'Portion', 3],
    ['Nuggets x6', 'Sauce au choix à la caisse', 4.5],
    ['Onion rings x8', 'Portion', 3.5]
  ] },
  { id: 'boissons', title: 'Boissons', kind: '', items: [
    ['Canette 33 cl', 'Coca, Fanta, Sprite, Ice Tea', 2],
    ['Ayran', 'Boisson au yaourt, 25 cl', 2.5],
    ['Eau 50 cl', 'Plate', 1.5]
  ] },
  { id: 'desserts', title: 'Desserts', kind: '', items: [
    ['Baklava x3', 'Pistache, miel', 4],
    ['Künefe', 'Fromage fondu, sirop, pistache (12 min)', 6]
  ] }
];

const $ = id => document.getElementById(id);
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const cart = new Map(); // clé (nom + description) -> { name, desc, price, qty }

// ---- Rendu de la carte ----
let n = 0;
const menuEl = $('menu'), catsEl = $('cats');
MENU.forEach(cat => {
  const a = document.createElement('a'); a.href = '#' + cat.id; a.textContent = cat.title; catsEl.appendChild(a);
  const sec = document.createElement('section'); sec.className = 'cat'; sec.id = cat.id;
  const h = document.createElement('h2'); h.textContent = cat.title; sec.appendChild(h);
  cat.items.forEach(([name, desc, price]) => {
    n++;
    const row = document.createElement('article'); row.className = 'item';
    row.innerHTML = '<span class="no"></span><div><h3></h3><p></p></div><div class="right"><span class="pr"></span><button type="button" class="add"></button></div>';
    row.querySelector('.no').textContent = cat.kind ? 'N°' + n : '';
    row.querySelector('h3').textContent = name;
    row.querySelector('p').textContent = desc;
    row.querySelector('.pr').textContent = eur(price);
    const btn = row.querySelector('.add');
    btn.textContent = cat.kind ? 'Choisir' : 'Ajouter';
    btn.setAttribute('aria-label', (cat.kind ? 'Choisir les options de ' : 'Ajouter ') + name);
    btn.addEventListener('click', () => cat.kind ? openDialog(cat.kind, name, desc, price) : addLine(name, '', price));
    sec.appendChild(row);
  });
  menuEl.appendChild(sec);
});
// Catégorie active au défilement
const links = [...catsEl.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-35% 0px -60% 0px' });
  document.querySelectorAll('.cat').forEach(s => io.observe(s));
}

// ---- Composeur ----
const dlg = $('dlg'), body = $('dlg-body');
let current = null;

function group(legend, hint, type, name, values, checked, cls) {
  const fs = document.createElement('fieldset'); fs.className = 'grp';
  fs.innerHTML = '<legend></legend><div class="opts"></div>';
  const lg = fs.querySelector('legend'); lg.textContent = legend;
  if (hint) { const s = document.createElement('small'); s.textContent = hint; lg.appendChild(s); }
  const box = fs.querySelector('.opts'); if (cls) box.classList.add(cls);
  values.forEach((v, i) => {
    const l = document.createElement('label'); l.className = 'opt';
    l.innerHTML = '<input><span></span>';
    const inp = l.querySelector('input'); inp.type = type; inp.name = name; inp.value = v;
    inp.checked = checked(v, i);
    l.querySelector('span').textContent = v;
    box.appendChild(l);
  });
  return fs;
}

function openDialog(kind, name, desc, price) {
  current = { kind, name, price };
  $('dlg-title').textContent = name;
  $('dlg-base').textContent = desc;
  body.textContent = '';
  if (kind === 'sandwich' || kind === 'plate') body.appendChild(group('Viande', '', 'radio', 'meat', MEATS, (v, i) => i === 0));
  if (kind !== '') body.appendChild(group('Sauces', 'deux au maximum', 'checkbox', 'sauce', SAUCES, () => false));
  if (kind === 'sandwich' || kind === 'burger') body.appendChild(group('Crudités', 'décochez pour retirer', 'checkbox', 'crud', CRUDITES, () => true, 'off'));
  if (kind === 'sandwich' || kind === 'burger') body.appendChild(group('Menu', 'frites + canette', 'radio', 'menu', ['Non', 'Oui, + ' + eur(MENU_EXTRA)], (v, i) => i === 0));
  refreshDialog();
  dlg.showModal();
}

function readDialog() {
  const f = $('dlg-form');
  const val = nm => { const e = f.querySelector('input[name=' + nm + ']:checked'); return e ? e.value : null; };
  const sauces = [...f.querySelectorAll('input[name=sauce]:checked')].map(i => i.value);
  const crud = [...f.querySelectorAll('input[name=crud]')];
  const removed = crud.filter(i => !i.checked).map(i => i.value);
  const menu = (val('menu') || '').startsWith('Oui');
  const parts = [];
  if (val('meat')) parts.push(val('meat'));
  parts.push(sauces.length ? 'sauces : ' + sauces.join(', ').toLowerCase() : 'sans sauce');
  removed.forEach(r => parts.push('sans ' + r.toLowerCase()));
  if (menu) parts.push('menu frites + canette');
  return { desc: parts.join(' · '), price: current.price + (menu ? MENU_EXTRA : 0), sauces };
}

function refreshDialog() {
  const f = $('dlg-form');
  const sauces = f.querySelectorAll('input[name=sauce]');
  const count = [...sauces].filter(i => i.checked).length;
  sauces.forEach(i => { i.disabled = count >= 2 && !i.checked; });
  $('dlg-ok').textContent = 'Ajouter · ' + eur(readDialog().price);
}
$('dlg-form').addEventListener('change', refreshDialog);
$('dlg-cancel').addEventListener('click', () => dlg.close());
$('dlg-form').addEventListener('submit', e => {
  e.preventDefault();
  const r = readDialog();
  addLine(current.name, r.desc, r.price);
  dlg.close();
});

// ---- Panier ----
function addLine(name, desc, price) {
  const key = name + '|' + desc;
  if (cart.has(key)) cart.get(key).qty++; else cart.set(key, { name, desc, price, qty: 1 });
  render();
  const b = $('open-cart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}

function totals() {
  const sub = [...cart.values()].reduce((s, l) => s + l.price * l.qty, 0);
  const mode = document.querySelector('input[name=mode]:checked').value;
  const fee = mode === 'Livraison' && sub > 0 && sub < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return { sub, fee, total: sub + fee, mode, count: [...cart.values()].reduce((s, l) => s + l.qty, 0) };
}

function render() {
  const ul = $('lines'); ul.textContent = '';
  cart.forEach((l, key) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="nm"></span><span class="lp"></span><span class="ds"></span><div class="stp"><button type="button" aria-label="Retirer un">−</button><b></b><button type="button" aria-label="Ajouter un">+</button></div>';
    li.querySelector('.nm').textContent = l.name;
    li.querySelector('.lp').textContent = eur(l.price * l.qty);
    li.querySelector('.ds').textContent = l.desc;
    li.querySelector('b').textContent = l.qty;
    const [minus, plus] = li.querySelectorAll('button');
    minus.addEventListener('click', () => { l.qty--; if (l.qty <= 0) cart.delete(key); render(); });
    plus.addEventListener('click', () => { l.qty++; render(); });
    ul.appendChild(li);
  });
  const t = totals();
  $('empty').hidden = t.count > 0;
  $('cart-count').textContent = t.count;
  $('s-sub').textContent = eur(t.sub);
  $('s-fee-row').hidden = t.mode !== 'Livraison';
  $('s-fee').textContent = t.fee ? eur(t.fee) : 'Offerte';
  $('s-tot').textContent = eur(t.total);
  $('bar-tot').textContent = eur(t.total);
  $('bar').classList.toggle('show', t.count > 0 && !$('cart').classList.contains('open'));
  $('adr-wrap').hidden = t.mode !== 'Livraison';
  $('hint').textContent = t.mode === 'Livraison'
    ? 'Minimum ' + eur(MIN_DELIVERY) + ' · frais ' + eur(DELIVERY_FEE) + ' · offerts dès ' + eur(FREE_DELIVERY_FROM) + '.' : '';
}
document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', render));

// Ouverture / fermeture du panier (mobile)
const cartEl = $('cart');
const setCart = open => { cartEl.classList.toggle('open', open); render(); if (open) cartEl.scrollTop = 0; };
$('open-cart').addEventListener('click', () => setCart(true));
$('bar').addEventListener('click', () => setCart(true));
$('close-cart').addEventListener('click', () => setCart(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cartEl.classList.contains('open')) setCart(false); });

// ---- Envoi ----
$('send').addEventListener('click', () => {
  const msg = $('msg'); msg.className = 'msg';
  const t = totals();
  const nom = $('f-nom').value.trim(), tel = $('f-tel').value.trim(), adr = $('f-adr').value.trim();
  const err = text => { msg.textContent = text; msg.classList.add('err'); };
  ['f-nom', 'f-tel', 'f-adr'].forEach(id => $(id).classList.remove('bad'));
  if (!t.count) return err('Le panier est vide.');
  if (!nom) { $('f-nom').classList.add('bad'); return err('Il manque votre prénom.'); }
  if (!tel) { $('f-tel').classList.add('bad'); return err('Il manque votre téléphone.'); }
  if (t.mode === 'Livraison') {
    if (!adr) { $('f-adr').classList.add('bad'); return err('Il manque l’adresse de livraison.'); }
    if (t.sub < MIN_DELIVERY) return err('Minimum de livraison : ' + eur(MIN_DELIVERY) + '. Il manque ' + eur(MIN_DELIVERY - t.sub) + '.');
  }
  if (!WHATSAPP) return err('Mode démo : renseignez WHATSAPP dans script.js pour recevoir les commandes.');

  const lines = [...cart.values()].map(l => l.qty + ' x ' + l.name + (l.desc ? ' (' + l.desc + ')' : '') + ' : ' + eur(l.price * l.qty));
  const note = $('f-note').value.trim();
  const text = ['Commande Anatolie Grill', ...lines,
    t.fee ? 'Livraison : ' + eur(t.fee) : '', 'Total : ' + eur(t.total), 'Mode : ' + t.mode,
    'Prénom : ' + nom, 'Tél : ' + tel, adr ? 'Adresse : ' + adr : '', note ? 'Note : ' + note : ''].filter(Boolean).join('\n');
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  msg.textContent = 'Commande prête : validez l’envoi dans WhatsApp.'; msg.classList.add('ok');
});

// ---- Statut ouvert / fermé ----
(function () {
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const [a, b] = OPEN[d];
  const prev = OPEN[(d + 6) % 7][1] - 24;          // après-minuit de la veille
  const open = (h >= a && h < Math.min(b, 24)) || h < prev;
  const el = $('status');
  el.textContent = open ? 'Ouvert' : 'Fermé · ouvre à ' + a + ' h';
  el.classList.toggle('open', open);
})();

render();
