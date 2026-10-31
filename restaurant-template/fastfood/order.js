// Numéro WhatsApp du commerce, format international sans + ni espaces (ex : 33612345678). Vide = la commande ne part pas.
const WHATSAPP = '';
const MIN_DELIVERY = 12; // minimum de commande pour la livraison (€)

// Menu mobile
const burger = document.getElementById('burger');
const menuNav = document.getElementById('menu-nav');
burger.addEventListener('click', () => {
  const open = menuNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menuNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menuNav.classList.remove('open')));

// Onglets de la carte
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

// Panier
const cart = {};          // { nom: { price, qty } }
const euro = n => n.toFixed(2).replace('.', ',') + ' €';
const el = id => document.getElementById(id);

function total() { return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0); }
function count() { return Object.values(cart).reduce((s, i) => s + i.qty, 0); }

function render() {
  const list = el('cart-list');
  list.innerHTML = '';
  Object.entries(cart).forEach(([name, it]) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="nm"></span><button data-d="-1" aria-label="Retirer">−</button><b>' + it.qty +
      '</b><button data-d="1" aria-label="Ajouter">+</button><span>' + euro(it.price * it.qty) + '</span>';
    li.querySelector('.nm').textContent = name; // textContent : pas d'injection HTML
    li.querySelectorAll('button').forEach(b => b.addEventListener('click', () => change(name, +b.dataset.d)));
    list.appendChild(li);
  });
  el('cart-empty').style.display = count() ? 'none' : 'block';
  el('cart-count').textContent = count();
  el('cart-total').textContent = el('cart-total-fab').textContent = euro(total());
}

function change(name, d) {
  if (!cart[name]) return;
  cart[name].qty += d;
  if (cart[name].qty <= 0) delete cart[name];
  render();
}

document.querySelectorAll('.add').forEach(btn => btn.addEventListener('click', () => {
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price);
  cart[name] = cart[name] ? { price, qty: cart[name].qty + 1 } : { price, qty: 1 };
  render();
  const fab = el('cart-open');
  fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump');
}));

const panel = el('cart');
const toggle = open => { panel.classList.toggle('open', open); panel.setAttribute('aria-hidden', !open); };
el('cart-open').addEventListener('click', () => toggle(true));
el('cart-close').addEventListener('click', () => toggle(false));

// Envoi WhatsApp
el('send').addEventListener('click', () => {
  const msg = el('cart-msg');
  msg.className = 'form-msg';
  const mode = document.querySelector('input[name=mode]:checked').value;
  const nom = el('c-nom').value.trim();
  const adr = el('c-adr').value.trim();

  const err = text => { msg.textContent = text; msg.classList.add('err'); };
  if (!count()) return err('Ajoutez au moins un article.');
  if (!nom) return err('Indiquez votre nom.');
  if (mode === 'Livraison' && !adr) return err('Indiquez votre adresse de livraison.');
  if (mode === 'Livraison' && total() < MIN_DELIVERY) return err('Minimum de livraison : ' + euro(MIN_DELIVERY) + '.');
  if (!WHATSAPP) return err('Mode démo : renseignez WHATSAPP dans order.js pour recevoir les commandes.');

  const lines = Object.entries(cart).map(([n, i]) => i.qty + ' x ' + n + ' (' + euro(i.price * i.qty) + ')');
  const text = ['Nouvelle commande', ...lines, 'Total : ' + euro(total()), 'Mode : ' + mode,
    'Nom : ' + nom, adr ? 'Adresse : ' + adr : '', el('c-note').value.trim() ? 'Note : ' + el('c-note').value.trim() : '']
    .filter(Boolean).join('\n');
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  msg.textContent = 'Commande prête : validez l\'envoi dans WhatsApp.';
  msg.classList.add('ok');
});

el('year').textContent = new Date().getFullYear();
render();
