// Horaires : jour (0 = dimanche) -> créneaux [ouverture, fermeture]. À garder identique au HTML.
const HOURS = { 0: [[18, 22]], 1: [], 2: [[18, 22]], 3: [[18, 22]], 4: [[18, 22]], 5: [[12, 14], [18, 23]], 6: [[12, 14], [18, 23]] };
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const fmt = h => Math.floor(h) + ' h' + (h % 1 ? ' 30' : '');

const now = new Date();
const dec = now.getHours() + now.getMinutes() / 60;
const today = HOURS[now.getDay()];
const open = today.find(([a, b]) => dec >= a && dec < b);
const nextToday = today.find(([a]) => dec < a);
let text;
if (open) text = 'Ouvert jusqu’à ' + fmt(open[1]);
else if (nextToday) text = 'Fermé, ouvre à ' + fmt(nextToday[0]);
else {
  text = 'Fermé';
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (HOURS[d].length) { text = 'Fermé, rouvre ' + (i === 1 ? 'demain' : DAYS[d]) + ' à ' + fmt(HOURS[d][0][0]); break; }
  }
}
const st = document.getElementById('status');
st.textContent = text;
st.classList.toggle('closed', !open);

// Jour courant dans la liste des horaires (ordre du HTML : mar-jeu, ven-sam, dim, lun)
const rows = document.querySelectorAll('.hours li');
const d = now.getDay();
const idx = d === 1 ? 3 : d === 0 ? 2 : d >= 5 ? 1 : 0;
if (rows[idx]) rows[idx].classList.add('today');

// Composeur : prix de base par taille, garniture par taille
const BASE = [9, 11];        // 26 cm, 33 cm
const TOP = [1, 1.5];
const form = document.getElementById('builder');
const totalEl = document.getElementById('total');
const lineEl = document.getElementById('line');
const euro = n => n.toFixed(2).replace('.', ',');

function update() {
  const size = +form.querySelector('input[name=size]:checked').value;
  const baseName = form.querySelector('input[name=base]:checked').nextElementSibling.textContent;
  const tops = [...form.querySelectorAll('input[name=top]:checked')].map(i => i.nextElementSibling.textContent);
  const total = BASE[size] + tops.length * TOP[size];
  totalEl.textContent = euro(total);
  lineEl.textContent = 'Base ' + baseName.toLowerCase() + ', ' + (size ? '33' : '26') + ' cm' + (tops.length ? ' + ' + tops.join(', ').toLowerCase() : '');
  const amount = totalEl.parentElement;
  amount.classList.remove('bump'); void amount.offsetWidth; amount.classList.add('bump');
}
form.addEventListener('change', update);
update();
