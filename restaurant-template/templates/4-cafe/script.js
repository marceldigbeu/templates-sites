// Moments de la journée : bornes en heures décimales. À adapter au client.
const PARTS = [
  { id: 'matin', title: 'Matin', from: 8, to: 11.5, label: '8 h – 11 h 30' },
  { id: 'midi', title: 'Midi', from: 11.5, to: 15, label: '11 h 30 – 15 h' },
  { id: 'gouter', title: 'Goûter', from: 15, to: 18, label: '15 h – 18 h' }
];
// Tags : V végétarien, VG vegan, SG sans gluten. Un plat vegan est aussi végétarien.
const ITEMS = {
  matin: [
    ['Tartine au levain, beurre et confiture de saison', 'Pain de la boulangerie d\'en face', 5.5, ['V']],
    ['Porridge d\'avoine, pomme cuite, cannelle', 'Au lait d\'avoine, sirop d\'érable', 7, ['VG', 'SG']],
    ['Granola maison, yaourt de brebis', 'Noisettes, miel de la région', 8, ['V']],
    ['Œufs brouillés, tartine, salade', 'Œufs de la ferme de Marcilly', 9.5, ['V']],
    ['Tartine avocat, citron, graines', 'Piment d\'Espelette en option', 9, ['VG']]
  ],
  midi: [
    ['Brunch complet', 'Œufs, tartine, granola, jus pressé, boisson chaude', 14, ['V']],
    ['Bowl de lentilles, carottes rôties, tahini', 'Citron confit, coriandre', 12, ['VG', 'SG']],
    ['Quiche du jour, salade', 'Demandez l\'ardoise', 10, ['V']],
    ['Soupe du moment, pain', 'Change tous les jours', 7.5, ['VG']],
    ['Sandwich poulet rôti, moutarde, cornichons', 'Pain au levain', 9, []]
  ],
  gouter: [
    ['Gâteau du jour', 'Le pâtissier le décide à 7 h', 5, ['V']],
    ['Cookie chocolat noir, fleur de sel', 'Cuit à 16 h', 3.5, ['V']],
    ['Cake citron-pavot', 'Sans produit laitier', 4.5, ['VG']],
    ['Financier aux amandes', 'Sans gluten', 3, ['V', 'SG']],
    ['Tartine beurre salé, chocolat', 'Pour les enfants et les autres', 4.5, ['V']]
  ]
};
const DRINKS = [
  ['Espresso', 2.4], ['Allongé', 2.6], ['Cappuccino', 3.8], ['Flat white', 4.2],
  ['Filtre du moment', 3.5], ['Chocolat chaud', 4], ['Thé en vrac', 3.8], ['Jus pressé', 5],
  ['Café glacé', 4.5]
];
const eur = n => n.toFixed(2).replace('.', ',').replace(',00', ',00') + ' €';

// Rendu du menu (textContent : pas d'injection HTML)
const pages = document.getElementById('pages');
PARTS.forEach(part => {
  const page = document.createElement('article');
  page.className = 'page'; page.dataset.part = part.id;
  page.innerHTML = '<header><h3></h3><p></p></header><ul></ul>';
  page.querySelector('h3').textContent = part.title;
  page.querySelector('p').textContent = part.label;
  const ul = page.querySelector('ul');
  ITEMS[part.id].forEach(([name, desc, price, tags]) => {
    const li = document.createElement('li');
    li.dataset.tags = tags.join(' ');
    li.innerHTML = '<div class="row"><b></b><span class="p"></span></div><p></p>';
    li.querySelector('b').textContent = name;
    tags.forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; li.querySelector('b').append(' ', s); });
    li.querySelector('.p').textContent = eur(price);
    li.querySelector('p').textContent = desc;
    ul.appendChild(li);
  });
  pages.appendChild(page);
});
const dl = document.getElementById('drinks');
DRINKS.forEach(([n, p]) => { const li = document.createElement('li'); li.innerHTML = '<span></span><b></b>'; li.firstChild.textContent = n; li.lastChild.textContent = eur(p); dl.appendChild(li); });

// Filtre de régime : estompe, ne cache pas. VG implique V.
document.querySelectorAll('input[name=diet]').forEach(r => r.addEventListener('change', () => {
  const v = r.value;
  document.querySelectorAll('.page li').forEach(li => {
    const t = li.dataset.tags.split(' ');
    const ok = v === 'all' || t.includes(v) || (v === 'V' && t.includes('VG'));
    li.classList.toggle('dim', !ok);
  });
}));

// Servi maintenant, statut, jour courant
const OPEN = { 0: [9, 17], 1: null, 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 18] };
const now = new Date();
const dec = now.getHours() + now.getMinutes() / 60;
const hrs = OPEN[now.getDay()];
const isOpen = !!hrs && dec >= hrs[0] && dec < hrs[1];
const current = isOpen ? PARTS.find(p => dec >= p.from && dec < p.to) : null;
const st = document.getElementById('status');
st.textContent = isOpen ? 'Ouvert' : 'Fermé';
st.classList.toggle('open', isOpen);
const DAYN = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
let small = 'Servi maintenant', big;
if (current) big = current.title;
else {
  small = 'Fermé pour l’instant';
  if (hrs && dec < hrs[0]) big = 'Ouvre à ' + hrs[0] + ' h';
  else {
    let i = 1; while (!OPEN[(now.getDay() + i) % 7]) i++;
    const nd = (now.getDay() + i) % 7;
    big = (i === 1 ? 'Demain' : DAYN[nd]) + ', ' + OPEN[nd][0] + ' h';
  }
}
document.querySelector('.sticker small').textContent = small;
document.getElementById('now').textContent = big;
if (current) document.querySelector('.page[data-part="' + current.id + '"]').classList.add('now');

const d = now.getDay();
const rowSel = d >= 2 && d <= 5 ? 2 : d;   // mardi–vendredi partagent la ligne data-d="2"
const row = document.querySelector('#hours tr[data-d="' + rowSel + '"]');
if (row) row.classList.add('today');
