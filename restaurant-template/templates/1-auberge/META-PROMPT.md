# Meta prompt — Site 1 : Auberge du Marronnier (restaurant traditionnel)

## Rôle
Tu es directeur artistique et développeur front. Tu construis UN site de restaurant qui ressemble à ce restaurant précis, pas à "un site de restaurant".

## Client (fictif mais précis)
Auberge familiale de village, 38 couverts + terrasse sous un marronnier. Cuisine bourgeoise de saison, produits à moins de 30 km. Le patron écrit le plat du jour à la craie chaque matin. Clients : habitués du midi (ouvriers, retraités, bureaux), familles le dimanche.
Prix réels : menu du midi 18,50 € (entrée + plat ou plat + dessert), carte 9–26 €.

## Promesse unique
« Ici on cuisine ce qu'il y a au marché le matin. » Tout le site sert cette phrase : l'ardoise du jour est le héros, pas une photo générique.

## Ton de voix
Un patron qui parle à un client au comptoir. Phrases courtes, concrètes, un peu d'humour sec. Noms de producteurs, distances, saisons.
Mots INTERDITS : passion, savoir-faire, expérience culinaire, authentique, gourmand(e) en adjectif creux, "plaisir de bien manger", "découvrez", "laissez-vous tenter".

## Direction artistique
- Concept : **la carte imprimée de bistrot**. Papier crème grainé, encre brune, filets, points de conduite entre plat et prix.
- Typo : Gloock (titres, caractère de presse du siècle dernier) + Newsreader (texte). Jamais Inter/Roboto/Playfair.
- Couleurs : papier #f3ead7, encre #2b2118, rouge brique #a5391f (une seule couleur d'accent), vert bouteille #2f4a3a pour les petits détails.
- Composition : asymétrique. Titre énorme à gauche, ardoise légèrement inclinée à droite qui chevauche la colonne. Carte en 2 colonnes comme un vrai menu, pas d'onglets ni de cartes arrondies.
- Détail signature : l'ardoise affiche la date du jour (JS) et le statut "Ouvert / Fermé" calculé depuis les horaires réels.
- Mouvement : une seule entrée orchestrée au chargement (décalage des blocs). Rien d'autre.

## Structure (ordre)
1. En-tête fin : nom, téléphone, statut ouvert/fermé en direct.
2. Hero + ardoise du jour.
3. La carte (2 colonnes, points de conduite, mentions V/S pour végétarien/sans gluten en lettres, pas d'icônes).
4. La maison : 2 paragraphes, noms de producteurs.
5. Venir / réserver : adresse, horaires (jour courant surligné), téléphone en premier, formulaire court ensuite.
6. Pied de page.

## Interdits anti-slop
Pas d'emoji. Pas d'avis clients inventés. Pas de chiffres inventés ("10 ans", "4,8/5"). Pas de dégradé violet/bleu. Pas de cartes à coins arrondis + ombre. Pas de bouton fantôme sur hero. Pas de bloc gris "photo ici". Pas de texte "Lorem".

## Images
Optionnelles : le site doit être beau SANS photo. Si `images/salle.jpg` existe, elle s'insère dans « La maison » (format 4:5).

## Validation (tout doit être vrai avant de livrer)
- [ ] Aucun mot interdit, aucun emoji, aucun chiffre inventé.
- [ ] Le statut ouvert/fermé et la date se calculent bien.
- [ ] Lisible à 360 px de large, contraste texte ≥ 4,5:1.
- [ ] Formulaire : champs obligatoires contrôlés, mode démo clair tant que ENDPOINT est vide.
- [ ] Le site ne ressemble à aucun des 4 autres templates.
