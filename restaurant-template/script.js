// Menu mobile
const burger = document.getElementById('burger');
const menuNav = document.getElementById('menu-nav');
burger.addEventListener('click', () => {
  const open = menuNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menuNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuNav.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// Onglets de la carte
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

// Réservation : date minimum = aujourd'hui
const dateInput = document.getElementById('date');
dateInput.min = new Date().toISOString().split('T')[0];

// Réservation : validation + envoi
// Pour un vrai envoi, mettez l'URL de votre service (Formspree, Netlify Forms, votre API)
const ENDPOINT = ''; // ex : 'https://formspree.io/f/xxxxxxx'

const form = document.getElementById('resa');
const msg = document.getElementById('msg');

form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.className = 'form-msg full';
  let valid = true;
  form.querySelectorAll('[required]').forEach(el => {
    const bad = !el.value.trim();
    el.classList.toggle('invalid', bad);
    if (bad) valid = false;
  });
  if (!valid) {
    msg.textContent = 'Merci de remplir les champs obligatoires.';
    msg.classList.add('err');
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  if (!ENDPOINT) {
    // Mode démo : aucun envoi réel
    console.log('Réservation (démo) :', data);
    msg.textContent = 'Demande reçue (mode démo : branchez ENDPOINT dans script.js pour un envoi réel).';
    msg.classList.add('ok');
    form.reset();
    return;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(res.status);
    msg.textContent = 'Merci ! Nous vous confirmons votre table très vite.';
    msg.classList.add('ok');
    form.reset();
  } catch {
    msg.textContent = 'Erreur d\'envoi. Appelez-nous au 01 00 00 00 00.';
    msg.classList.add('err');
  }
});

// Année du pied de page
document.getElementById('year').textContent = new Date().getFullYear();

// Sélecteur de thème (démo) : ?theme=zen dans l'URL, mémorisé
const themeLink = document.getElementById('theme');
const themeSwitch = document.getElementById('theme-switch');
function setTheme(name) {
  themeLink.href = 'themes/' + name + '.css';
  if (themeSwitch) themeSwitch.value = name;
  localStorage.setItem('theme', name);
}
setTheme(new URLSearchParams(location.search).get('theme') || localStorage.getItem('theme') || 'classique');
if (themeSwitch) themeSwitch.addEventListener('change', e => setTheme(e.target.value));
