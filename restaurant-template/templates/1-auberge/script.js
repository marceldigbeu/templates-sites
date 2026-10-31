// Horaires : jour (0 = dimanche) -> créneaux [ouverture, fermeture] en heures décimales.
// À garder identique au tableau d'horaires du HTML.
const HOURS = {
  0: [[12, 15]],
  1: [],
  2: [[12, 14.5]],
  3: [[12, 14.5], [19, 21.5]],
  4: [[12, 14.5], [19, 21.5]],
  5: [[12, 14.5], [19, 22]],
  6: [[19, 22]]
};
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const now = new Date();
const dec = now.getHours() + now.getMinutes() / 60;
const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ' h' + (m ? ' ' + String(m).padStart(2, '0') : ''); };

// Date sur l'ardoise
document.getElementById('slate-date').textContent =
  DAYS[now.getDay()] + ' ' + now.getDate() + ' ' + MONTHS[now.getMonth()];

// Statut ouvert / fermé
function status() {
  const today = HOURS[now.getDay()];
  const open = today.find(([a, b]) => dec >= a && dec < b);
  if (open) return ['b', 'Ouvert', ' jusqu’à ' + fmt(open[1])];
  const next = today.find(([a]) => dec < a);
  if (next) return ['b', 'Fermé', ', ouvre à ' + fmt(next[0])];
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (HOURS[d].length) return ['b', 'Fermé', ', rouvre ' + (i === 1 ? 'demain' : DAYS[d]) + ' à ' + fmt(HOURS[d][0][0])];
  }
  return ['b', 'Fermé', ''];
}
const [, word, rest] = status();
const st = document.getElementById('status');
st.innerHTML = '<b></b><span></span>';
st.firstChild.textContent = word;
st.lastChild.textContent = rest;
st.classList.toggle('closed', word === 'Fermé');

// Jour courant surligné
const row = document.querySelector('#hours tr[data-d="' + now.getDay() + '"]');
if (row) row.classList.add('today');

// Formulaire
const dateInput = document.getElementById('date');
dateInput.min = now.toISOString().split('T')[0];

const ENDPOINT = ''; // ex : 'https://formspree.io/f/xxxxxxx'. Vide = mode démo, rien n'est envoyé.
const form = document.getElementById('resa');
const msg = document.getElementById('msg');

form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.className = 'msg';
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle('bad', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = 'Il manque des champs : ils sont en rouge.'; msg.classList.add('err'); return; }

  const data = Object.fromEntries(new FormData(form));
  if (!ENDPOINT) {
    console.log('Demande (démo)', data);
    msg.textContent = 'Mode démo : rien n’a été envoyé. Renseignez ENDPOINT dans script.js.';
    msg.classList.add('ok');
    return;
  }
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error(r.status);
    msg.textContent = 'Reçu. On vous rappelle pour confirmer.';
    msg.classList.add('ok');
    form.reset();
  } catch {
    msg.textContent = 'Ça n’a pas marché. Appelez-nous, c’est plus sûr.';
    msg.classList.add('err');
  }
});
