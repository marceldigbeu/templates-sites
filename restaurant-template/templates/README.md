# Templates restaurant (v2, sans AI slop)

Chaque dossier = un site complet, autonome, avec **son meta prompt** (`META-PROMPT.md`) qui fixe le client, le ton, la direction artistique, les interdits et la checklist de validation.

| Dossier | Type | Idée forte |
|---|---|---|
| `1-auberge/` | Restaurant traditionnel | Carte imprimée, ardoise du jour datée, statut ouvert/fermé en direct |
| `2-table/` | Gastronomique, menu unique | Typo Didone géante, réservation en 4 gestes (jours réellement ouvrables) |
| `3-pizzeria/` | Pizzeria | Écran scindé, tableau de prix 26/33 cm, composeur de pizza |
| `4-cafe/` | Café, brunch | Zine en risographie, « Servi maintenant », filtre de régime |
| `5-kebab/` | Snack, kebab | Commande en une minute : viande, sauces, crudités, menu, envoi WhatsApp |

Les anciens modèles sont dans `../templates-v1/`.

## Adapter pour un client
1. Copier le dossier, le renommer.
2. Relire `META-PROMPT.md` : remplacer le client fictif par le vrai (adresse, horaires, prix, ton). Si besoin, redonner ce meta prompt à Claude pour régénérer les textes.
3. `index.html` : tous les textes sont des exemples (repérés par `À PERSONNALISER`). Aucun avis ni chiffre n'est inventé : n'en ajouter que de vrais.
4. `script.js` : horaires (`HOURS` / `OPEN`), prix et options, puis `ENDPOINT` (formulaire) ou `WHATSAPP` (kebab). Vides = mode démo, rien n'est envoyé.
5. `style.css` : couleurs dans `:root` en haut.
6. `images/` : photos optionnelles, noms attendus indiqués dans chaque META-PROMPT. Sans photo, les sites restent propres.
7. Mettre en ligne : Netlify, Vercel ou GitHub Pages, en déposant le dossier tel quel.

## Avant de livrer
Dérouler la checklist « Validation » du META-PROMPT du template choisi, et relire le texte : aucun mot de la liste interdite.

## Motion (site 2 seulement pour l'instant)
`2-table/` utilise la librairie Motion : meta prompt `META-PROMPT-MOTION.md`, source `src/effects.js`, fichier compilé `effects.js` (32,7 ko compressé).
Modifier la source puis `npm install && npm run build` dans `2-table/`. Sans le script, le site reste complet. Reduced motion et écrans tactiles : pas de curseur perso, pas d'animation.

## Version React de Sillage (`2-table-react/`)
Révélation par découpe sur les plats et sur la citation de la cheffe, trait de signature qui se dessine. `npm install`, `npm run dev`, `npm run build` (sortie dans `dist/`, déployable tel quel). Voir `COMPOSANTS.md`. Bundle : environ 124 ko compressés (React + Motion), contre 33 ko pour la version HTML.
