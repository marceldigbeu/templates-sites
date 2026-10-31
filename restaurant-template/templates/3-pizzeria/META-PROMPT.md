# Meta prompt — Site 3 : Chez Tonio (pizzeria napolitaine au feu de bois)

## Rôle
Directeur artistique et développeur front. Tu fais le site d'un lieu qui a du caractère, pas celui d'une chaîne.

## Client (fictif mais précis)
Pizzeria de quartier, 24 places, four à bois à 450 °C, pâte à 48 h de fermentation, tenue par Tonio (originaire de Naples) et sa sœur. Sur place et à emporter. **Pas de livraison** (« une pizza voyage mal »). Fermé le lundi. Prix : 9–16 €, deux tailles (26 et 33 cm).

## Promesse unique
« 450 °C. 90 secondes. » Un fait vérifiable, mémorisable, qui structure le site entier.

## Ton de voix
Franc, chaleureux, un peu bourru. Phrases courtes, quelques mots d'italien seulement quand ils sont justes (cornicione, fior di latte). On assume : pas de livraison, pas d'ananas, pas de ketchup.
Mots INTERDITS : authentique, tradition, passion, régal, "pizzas artisanales" (dire comment : pâte 48 h), "fait maison" sans précision.

## Direction artistique
- Concept : **affiche de rue + nappe à carreaux**. Aplats francs, grosse slab serif, bandeau vichy rouge/crème en séparateur.
- Typo : Alfa Slab One (titres, chiffres) + Archivo (texte, étroit pour les tarifs). Pas de script « italien » cliché, pas de Playfair.
- Couleurs : tomate #d8321f, crème #f5ecd7, vert basilic #1f4d36, encre #1b1410. Rouge et vert en grands aplats, jamais en dégradé.
- Composition : **écran scindé**. Panneau gauche fixe (rouge) avec nom, « 450 °C. 90 secondes. », horaires, téléphone. Panneau droit crème : la carte comme un tableau d'affichage avec deux colonnes de prix (26 / 33 cm).
- Détail signature : le **composeur de pizza** (base, taille, garnitures → prix en direct), à la place d'un bouton « Commander » factice. On appelle ensuite pour commander.
- Mouvement : léger rebond du total quand il change. Rien d'autre.

## Structure
1. Panneau fixe : nom, fait, horaires, tél, statut ouvert/fermé.
2. Les Rosse (base tomate) / Les Bianche (base crème) : lignes nom, ingrédients, 2 prix.
3. Composeur de pizza.
4. Infos : sur place / à emporter / pas de livraison, allergènes, adresse.

## Interdits anti-slop
Pas d'emoji de pizza. Pas de photo stock. Pas d'avis inventés. Pas de chiffres inventés au-delà des faits métier du brief. Pas de cartes arrondies, pas de dégradés, pas de bandeau défilant.

## Images
Aucune requise. Si `images/four.jpg` existe (format paysage, flamme visible), elle remplace le motif vichy en haut du panneau droit.

## Validation
- [ ] Le composeur calcule juste (base + garnitures par taille) et reste utilisable au clavier.
- [ ] Panneau gauche fixe en bureau, empilé en mobile sans débordement à 360 px.
- [ ] Aucun mot interdit, aucun emoji.
- [ ] Contraste ≥ 4,5:1 (crème sur rouge, crème sur vert).
- [ ] Différent des 4 autres templates.
