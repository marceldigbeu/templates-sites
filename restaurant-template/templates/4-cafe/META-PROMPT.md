# Meta prompt — Site 4 : Graine (café, brunch, torréfaction)

## Rôle
Directeur artistique et développeur front. Tu fais le site d'un café de quartier qui a une identité d'imprimé indépendant, pas d'appli de bien-être.

## Client (fictif mais précis)
« Graine » : café-torréfacteur et brunch, 28 places + terrasse, chiens acceptés, lait végétal sans supplément. Servi par moments de la journée : matin (8 h–11 h 30), midi (11 h 30–15 h), goûter (15 h–18 h). Ouvert mardi au samedi 8 h–18 h, dimanche 9 h–17 h, fermé le lundi. Ordinateurs bienvenus, sauf le samedi et le dimanche de 11 h à 14 h.
Prix : café 2,40–4,50 €, brunch 9–14 €.

## Promesse unique
« On torréfie le café ici, le reste suit. » Le site montre ce qu'on mange maintenant, pas un menu figé.

## Ton de voix
Clair, drôle sans forcer, précis sur les produits (origine du café, farine du pain). Pas de vocabulaire bien-être.
Mots INTERDITS : healthy, gourmand, cocooning, "moment de partage", detox, superaliments, "fait avec amour", "pause".

## Direction artistique
- Concept : **zine imprimé en risographie, deux encres**. Papier ivoire, orange fluo et vert-bleu, légers décalages de registre (ombre portée décalée dans l'autre encre), trame de points.
- Typo : Young Serif (titres) + Hanken Grotesk (texte). Pas d'Inter, pas de Playfair.
- Couleurs : papier #f4efe4, encre orange #ff6a3d, encre vert-bleu #00806a, texte #1d1a16. Les deux encres se superposent avec `mix-blend-mode: multiply`.
- Composition : 3 « pages » de zine côte à côte (matin, midi, goûter), étiquettes légèrement inclinées, collage. Pas de cartes à ombre douce.
- Détail signature : **« Servi maintenant »** calculé à l'heure réelle, et un filtre de régime (Tout / Végétarien / Vegan / Sans gluten) qui estompe ce qui ne convient pas, sans le cacher.
- Mouvement : aucun hors survol. Respecter prefers-reduced-motion.

## Structure
1. En-tête : nom, statut ouvert/fermé.
2. Hero : phrase + pastille « Servi maintenant ».
3. Le menu : filtre + 3 pages (matin, midi, goûter) + boissons.
4. Le café : 3 lignes sur la torréfaction (origine du moment).
5. Pratique : horaires, adresse, règles (chiens, ordinateurs, lait végétal).

## Interdits anti-slop
Pas d'emoji, pas d'avis inventés, pas de bento arrondi + ombres, pas de feuille/plante décorative, pas de dégradé pastel, pas de chiffres inventés, pas de bloc photo gris.

## Images
Optionnelles. `images/cafe.jpg` (format carré, lumière naturelle) apparaît dans la section Le café, traitée en bichromie par CSS.

## Validation
- [ ] « Servi maintenant » correspond à l'heure réelle (matin / midi / goûter / fermé).
- [ ] Le filtre estompe correctement et reste clavier-accessible.
- [ ] Aucun mot interdit ni emoji. Tags V / VG / SG en lettres.
- [ ] Contraste ≥ 4,5:1 pour les textes (le texte courant n'est jamais en orange sur ivoire).
- [ ] 360 px sans défilement horizontal. Différent des 4 autres templates.
