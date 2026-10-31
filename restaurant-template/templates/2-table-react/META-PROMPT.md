# Meta prompt — Sillage, version React (composants 21st.dev + Motion)

## Rôle
Directeur artistique et développeur front. Tu reconstruis le site Sillage (voir `../2-table/META-PROMPT.md`, à respecter en tout point : client, ton, interdits, palette) en React + Vite + Tailwind, en y intégrant **quelques composants 21st.dev** choisis pour ce qu'ils apportent réellement, pas pour faire riche.

## Règle d'or
Un composant n'entre dans le site que s'il (1) répond à un besoin du site, (2) peut être mis aux couleurs et à la typo de Sillage sans que ça se voie qu'il vient d'ailleurs, (3) a un code lisible et sain. Sinon on l'écrit nous-mêmes. 3 composants maximum.

## Cadre technique
- React 19 + Vite + Motion (Tailwind écarté : le design vit dans un seul `style.css` repris de `2-table`) (`motion/react`, jamais `framer-motion`).
- Structure : `src/components/` (composants 21st.dev, adaptés), `src/sections/` (Hero, Menu, Chef, Reservation, Footer), `src/lib/` (utilitaires, horaires).
- Les composants 21st.dev sont **copiés comme du code source** après lecture complète. Aucun `npx` ou script distant exécuté sans lecture préalable ; aucune clé API ; aucun compte ; pas de MCP « Magic ».
- Dépendances ajoutées seulement si le composant l'exige (ex. `clsx`, `tailwind-merge`) et si elles sont connues et maintenues.

## Direction artistique (inchangée)
Fond #0f0e0c, texte #e9e3d6, discret #8d8678, vermillon #d4472b (un point, l'état sélectionné). Bodoni Moda + DM Mono. Pas d'or, pas de dégradé, pas de verre dépoli, pas de glow, pas de coins très arrondis.
Tout composant 21st.dev est recoloré avec ces variables : on retire gradients, ombres colorées, arrondis excessifs, textes d'exemple.

## Mouvement
Mêmes 5 intentions que `2-table/META-PROMPT-MOTION.md` (curseur contextuel, nom lettre par lettre, nom qui s'éloigne, plats qui se posent + filet de progression, retour d'interaction à la réservation), réalisées avec `motion/react` (`motion.*`, `useScroll`, `useTransform`, `whileInView`, `whileTap`). Ressorts sans rebond. `prefers-reduced-motion` : tout apparaît d'emblée. Utiliser `MotionConfig reducedMotion="user"`.

## Choix des composants
Cherche sur 21st.dev, par ordre de besoin : (1) une révélation de texte, (2) un sélecteur de date ou de créneau pour la réservation, (3) un curseur ou un effet de survol. Pour chaque candidat : noter nom, auteur, licence, dépendances, ce qu'on garde et ce qu'on retire. Rejeter tout ce qui exige un compte, une clé ou un service externe.

## Interdits
Pas d'effet « vitrine de composants » (marquee, bento, 3D gratuit), pas de texte inventé, pas d'emoji, pas d'avis ou chiffres inventés, pas de bibliothèque d'UI complète pour un seul bouton.

## Validation
- [ ] Le site est visuellement identique en intention à `2-table` (même palette, même ton), pas un look 21st.dev par défaut.
- [ ] Chaque composant externe est listé dans `COMPOSANTS.md` : nom, auteur, URL, licence, dépendances, modifications.
- [ ] `npm run build` passe sans avertissement bloquant ; aucune dépendance inutile.
- [ ] Reduced motion et sans souris : site complet, focus clavier visible.
- [ ] Réservation : seuls mercredi–samedi proposés, 4 interactions maximum.
- [ ] 360 px sans défilement horizontal ; contraste ≥ 4,5:1.
