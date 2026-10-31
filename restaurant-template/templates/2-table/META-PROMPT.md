# Meta prompt — Site 2 : Sillage (table gastronomique, un seul menu)

## Rôle
Directeur artistique et développeur front. Tu construis le site d'une table à menu unique où chaque mot supplémentaire est une faute de goût.

## Client (fictif mais précis)
« Sillage » : 18 couverts, un seul menu en cinq temps, du mercredi au samedi soir, deux services (19 h, 21 h 15). Cheffe : Inès Barral. Cuisine de poissons de petite pêche et de légumes de la région, cuissons courtes. Clientèle : réservation à l'avance, occasions, curieux de gastronomie.
Prix réels : menu 78 €, accord mets-vins 42 €, version végétale 68 € (sur demande 48 h avant). Annulation gratuite jusqu'à 48 h.

## Promesse unique
« Cinq temps. Dix-huit couverts. » Rareté et précision. Le site fait peu et le fait parfaitement : montrer le menu, permettre de réserver en moins de 30 secondes.

## Ton de voix
Sobre, factuel, jamais emphatique. La cheffe parle à la première personne, trois phrases maximum. Les plats sont nommés par leurs ingrédients, sans adjectif de luxe.
Mots INTERDITS : sublimer, voyage, symphonie, émotion, excellence, étoilé (sauf si vrai), "expérience gastronomique", "ode à", "revisité".

## Direction artistique
- Concept : **un carton de menu dans le noir**. Fond presque noir chaud, grand nom en italique Didone qui déborde de l'écran, beaucoup de vide, légendes minuscules en monospace.
- Typo : Bodoni Moda (titres, italique, chiffres) + DM Mono (légendes, prix, infos). Jamais de sans-serif générique.
- Couleurs : fond #0f0e0c, texte #e9e3d6, discret #8d8678, vermillon #d4472b utilisé UNIQUEMENT pour un point et l'état sélectionné. Pas d'or, pas de doré (cliché du luxe).
- Composition : numéros de plats géants en contour, texte aligné sur une colonne décalée, filets fins. Beaucoup d'espace vertical.
- Détail signature : le sélecteur de réservation (jours réellement ouvrables générés en JS, deux services, couverts) à la place d'un formulaire classique.
- Mouvement : apparition douce et décalée des 5 plats au scroll (IntersectionObserver), rien d'autre. Respecter prefers-reduced-motion.

## Structure (ordre)
1. En-tête minimal : nom, lien « Réserver ».
2. Hero : nom géant, une ligne de faits (menu, couverts, jours), adresse.
3. Le menu : 5 temps numérotés + prix + options (accord, végétal).
4. La cheffe : trois phrases.
5. Réserver : sélecteur de date → service → couverts → coordonnées. Récapitulatif avant envoi.
6. Pied de page : adresse, politique d'annulation, allergènes.

## Interdits anti-slop
Pas d'emoji, pas d'or/doré, pas de grille de cartes, pas d'avis inventés, pas de « notre histoire », pas de stats inventées, pas de bouton « Découvrir », pas de photo-placeholder grise.

## Images
Aucune requise. Le site est typographique. Si `images/cheffe.jpg` existe (portrait 3:4, lumière naturelle, pas de pose de pub), elle s'affiche à côté du texte de la cheffe.

## Validation
- [ ] Aucun mot interdit, aucun emoji, pas de doré.
- [ ] Seuls mercredi–samedi sont proposés ; les dates passées n'apparaissent pas.
- [ ] On réserve en 4 interactions max (date, service, couverts, envoyer + coordonnées).
- [ ] Clavier : tous les choix sont atteignables et visibles au focus (boutons radio).
- [ ] 360 px sans défilement horizontal ; contraste ≥ 4,5:1.
- [ ] Différent des 4 autres templates.
