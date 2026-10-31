// À PERSONNALISER : exemples
export const COURSES = [
  { title: 'Huître, pomme verte, raifort', text: "Huître de Marennes, eau de pomme clarifiée, raifort frais." },
  { title: 'Betterave cuite en croûte de sel', text: "Crème de brebis fumée, noisettes torréfiées, vinaigre de cidre." },
  { title: 'Lieu jaune, chou-fleur, beurre noisette', text: "Poisson de ligne du matin, cuit à l'unilatérale. Câpres, citron brûlé." },
  { title: 'Pigeon, céleri, jus de cuisson', text: "Pigeonneau rôti sur os, céleri-rave en deux textures, baies de genièvre." },
  { title: 'Poire, sarrasin, lait ribot', text: "Poire pochée au sirop de thym, croustillant de sarrasin, glace au lait ribot." }
]

export const PRICES = [
  ['Menu cinq temps', '78 €'],
  ['Accord mets & vins, cinq verres', '42 €'],
  ['Version végétale, sur demande 48 h avant', '68 €']
]

export const CHEF = {
  quote: "Je cuisine ce que les bateaux ramènent et ce que mes voisins cultivent. Le menu tient sur une carte parce que je ne sais pas mentir en cuisine. Venez avec de la place, on prend notre temps.",
  name: 'Inès Barral'
}

// Jours ouvrables : mercredi (3) à samedi (6)
export const OPEN_DAYS = [3, 4, 5, 6]
export const HORIZON = 28
export const SERVICES = ['19 h 00', '21 h 15']
export const ENDPOINT = '' // ex : 'https://formspree.io/f/xxxxxxx'. Vide = mode démo, rien n'est envoyé.
