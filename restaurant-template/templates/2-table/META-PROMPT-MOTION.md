# Meta prompt — Motion pour Sillage (site 2)

## Rôle
Directeur de mouvement. Tu ajoutes de l'animation avec la librairie Motion (gratuite, `motion`, JS pur) à un site qui vit du silence : chaque mouvement doit justifier sa présence.

## Règle d'or
Un mouvement doit montrer **un changement d'état**, **une relation entre éléments** ou **un retour à une action**. Sinon, il n'existe pas. Pas de décoration.

## Caractère du mouvement (propre à Sillage)
- Lent, sans rebond : un carton de menu qui se pose, pas un jeu. Ressorts avec `bounce: 0`, `visualDuration` 0,5–0,9 s pour les grandes surfaces, 0,2–0,3 s pour les retours d'interaction.
- Un seul sens de lecture : de bas en haut, ou de droite à gauche (le « sillage » : ce qui s'éloigne part vers la gauche).
- Aucune propriété coûteuse : seulement `transform`, `opacity`, `filter`. Jamais `width`, `top`, `left`.

## Les 5 animations retenues (et pourquoi)
1. **Curseur personnalisé** (point vermillon, ressort). Il s'adapte à ce qu'il survole : anneau sur liens et boutons (« ceci est cliquable »), cercle avec « 01 / 05 » sur les plats (position dans le menu), « Réserver » sur le lien et le bouton d'envoi, disparition sur les champs de texte (le vrai curseur de saisie reprend). Uniquement sur appareils à souris précise. Le curseur natif n'est masqué que si le curseur perso fonctionne.
2. **Nom du hero lettre par lettre** (`animate` + `stagger`) : montée + dé-flou, 0,06 s entre lettres. Montre que la page arrive, une seule fois.
3. **Le nom s'éloigne au défilement** (`scroll`) : dérive vers la gauche et s'estompe quand on quitte le hero. Relation entre la position de lecture et l'élément.
4. **Menu** : (a) chaque plat se pose en entrant dans l'écran (`inView`, décalage), (b) un filet vermillon à gauche se remplit avec la progression (`scroll`) : « vous en êtes au plat 3 sur 5 ».
5. **Réservation** : retour d'interaction sur les choix (`press` sur liens et boutons, événements pointeur sur les choix qui sont des `<span>`, pour ne pas les rendre focusables : le bouton s'enfonce légèrement), et le récapitulatif se renouvelle à chaque changement (fondu + 8 px) pour confirmer que le choix est pris en compte.

## Interdits
Pas de parallaxe gratuite, pas de texte qui défile en boucle, pas de rebond, pas de zoom d'images, pas de transition de page, pas d'animation qui bloque la lecture (> 1 s pour du contenu utile), pas de curseur qui retarde la sélection de plus de 100 ms.

## Accessibilité et robustesse
- `prefers-reduced-motion: reduce` → tout apparaît d'emblée, aucun curseur perso, aucun défilement animé.
- Sans JavaScript ou si le script échoue : tout le contenu reste visible (on ne cache qu'une fois le script chargé).
- Le curseur perso n'existe que si `(hover: hover) and (pointer: fine)`.
- Le focus clavier reste visible et inchangé.

## Technique
`src/effects.js` (source) importe `animate, press, inView, scroll, stagger` depuis `motion` (le curseur écoute `pointerover` : `hover()` ne gère pas les états qui se chevauchent). `npm run build` produit `effects.js` (IIFE, un seul fichier, fonctionne aussi ouvert depuis le disque). Ne jamais importer `framer-motion`.

## Validation
- [ ] Chaque animation correspond à l'une des 5 lignes ci-dessus.
- [ ] Reduced motion : rien ne bouge, tout est visible, curseur natif.
- [ ] Sans le script d'effets : site complet et lisible.
- [ ] Aucun retard perçu au clic (curseur, boutons).
- [ ] Pas de défilement horizontal, pas de saut de mise en page (CLS) provoqué par les animations.
- [ ] Taille du script d'effets < 40 ko compressé (gzip).
