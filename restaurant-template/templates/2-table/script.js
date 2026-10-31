// Jours ouvrables : mercredi (3) à samedi (6), sur les 28 prochains jours, à partir de demain.
const OPEN_DAYS = [3, 4, 5, 6];
const HORIZON = 28;
const DAY = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONTH = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const daysBox = document.getElementById('days');
const start = new Date(); start.setHours(0, 0, 0, 0);
for (let i = 1; i <= HORIZON; i++) {
  const d = new Date(start); d.setDate(start.getDate() + i);
  if (!OPEN_DAYS.includes(d.getDay())) continue;
  const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const label = document.createElement('label');
  label.innerHTML = '<input type="radio" name="date" required><span><small></small><b></b><small></small></span>';
  label.querySelector('input').value = iso;
  const [s1, b, s2] = label.querySelectorAll('small, b');
  s1.textContent = DAY[d.getDay()]; b.textContent = d.getDate(); s2.textContent = MONTH[d.getMonth()];
  label.querySelector('input').dataset.text = DAY[d.getDay()] + ' ' + d.getDate() + ' ' + MONTH[d.getMonth()];
  daysBox.appendChild(label);
}

// Récapitulatif
const form = document.getElementById('resa');
const recap = document.getElementById('recap');
function updateRecap() {
  const date = form.querySelector('input[name=date]:checked');
  const svc = form.querySelector('input[name=service]:checked');
  const n = form.querySelector('input[name=couverts]:checked');
  if (!date && !svc) { recap.textContent = 'Aucune soirée choisie.'; return; }
  recap.textContent = [date ? date.dataset.text : '…', svc ? svc.value : '…', n ? n.value + (n.value === '1' ? ' couvert' : ' couverts') : ''].join(' · ');
}
form.addEventListener('change', updateRecap);

// Envoi
const ENDPOINT = ''; // ex : 'https://formspree.io/f/xxxxxxx'. Vide = mode démo, rien n'est envoyé.
const msg = document.getElementById('msg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.className = 'msg';
  const miss = [];
  if (!form.querySelector('input[name=date]:checked')) miss.push('le jour');
  if (!form.querySelector('input[name=service]:checked')) miss.push('le service');
  ['nom', 'email', 'tel'].forEach(k => {
    const f = form.elements[k];
    const bad = !f.value.trim() || (k === 'email' && !f.checkValidity());
    f.classList.toggle('bad', bad);
    if (bad) miss.push({ nom: 'votre nom', email: 'un courriel valide', tel: 'votre téléphone' }[k]);
  });
  if (miss.length) { msg.textContent = 'Il manque : ' + miss.join(', ') + '.'; msg.classList.add('err'); return; }

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
    msg.textContent = 'Demande reçue. Confirmation par courriel sous 24 h.';
    msg.classList.add('ok');
    form.reset(); updateRecap();
  } catch {
    msg.textContent = 'L’envoi a échoué. Écrivez-nous : bonjour@example.fr.';
    msg.classList.add('err');
  }
});
