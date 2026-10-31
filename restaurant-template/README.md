# Template site restaurant

Site statique, sans dépendance. Ouvrir `index.html` dans le navigateur.

## Personnaliser pour un client
1. **Nom** : chercher "Le Bon Goût" dans `index.html` (titre, logo, footer).
2. **Couleurs** : variables `:root` en haut de `style.css` (`--accent` surtout).
3. **Carte** : modifier les blocs `<article class="item">` dans `index.html`.
4. **Photos** : mettre les images dans `images/` ; `hero.jpg` est le fond de l'accueil.
   Galerie : dans `style.css`, ex. `.g1 { background-image: url('images/plat1.jpg'); }`.
5. **Adresse, téléphone, horaires** : section `#contact`. Remplacer le bloc `.map` par un iframe Google Maps.
6. **Réservation** : renseigner `ENDPOINT` dans `script.js` (Formspree, Netlify Forms, API). Vide = mode démo.
7. **Réseaux / mentions légales** : liens du footer.

## Mettre en ligne
Netlify, Vercel, GitHub Pages ou n'importe quel hébergeur : déposer le dossier tel quel.

## Thèmes
`themes/` : classique, gastro (sombre/doré), bistro (pizzeria rustique), zen (minimal vert).
Le sélecteur en bas à droite est une démo pour le client : le supprimer ensuite et fixer le thème choisi
dans `<link id="theme">`. Créer un thème = copier un fichier de `themes/` et changer les variables.

## Variante fast food / kebab (`fastfood/`)
Ouvrir `fastfood/index.html`. Jaune/rouge/noir, formules, carte avec boutons "+", panier, commande par WhatsApp.
- Numéro : `WHATSAPP` dans `fastfood/order.js` (ex : `'33612345678'`). Vide = mode démo, rien ne part.
- Prix : attributs `data-price` des boutons dans `fastfood/index.html` (à garder égaux au prix affiché).
- Minimum livraison : `MIN_DELIVERY` dans `order.js`. Zone et frais : section Infos.
- Photo d'accueil : `images/hero-fastfood.jpg`.
