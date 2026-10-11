# SJI INNOVA 2027 — Refonte du site : document d'implémentation

Oct 11, 2026 · @Marvin

## Diagnostic du site actuel

Deux problèmes se cumulent : le site parle encore de l'édition 2026 alors que le dossier de partenariat porte sur l'édition 2027, et sa forme est celle d'un template générique. Le second problème est celui que tu décris comme « trop IA » ; il a des causes précises, listées plus bas.

**Constat technique.** Le HTML servi par [test-nova-seven.vercel.app](https://test-nova-seven.vercel.app/) ne contient que les métadonnées : tout le contenu est rendu côté client par Angular, sans SSR ni prerender. Conséquences directes — page blanche tant que le bundle JS n'a pas chargé, indexation Google quasi nulle, aperçu de partage WhatsApp/LinkedIn limité aux balises `og:`. Sur une connexion 3G camerounaise, c'est plusieurs secondes d'écran vide avant le premier pixel utile.

**Incohérences de contenu relevées dans les métadonnées :**

| Élément | Valeur actuelle | Valeur attendue (dossier 2027) |
| --- | --- | --- |
| Édition | SJI INNOVA 2026 | SJI INNOVA 2027, 2ᵉ édition |
| Date limite annoncée | 20 février 2026 | dépôts du 16 nov. 2026 au 18 déc. 2026 |
| Finale | non mentionnée | 10 février 2027, 13h–17h |
| `og:url` | campus-event-three.vercel.app | domaine définitif du projet |
| `og:image` | logo IUSJC détouré 768×301 | visuel 1200×630 dédié SJI INNOVA |
| Nom de l'organisation | Université Saint Jean Ingénieur / IUSJC | Saint Jean Ingénieur (SJI), campus d'Etok-Koss |
| Lieu | absent | Grande salle Licence 1 francophone, Yaoundé |

**Les sept marqueurs du « design IA ».** Ce sont eux qu'il faut éliminer un par un — ils sont présents sur la quasi-totalité des sites générés sans direction artistique :

1. **Dégradé violet/bleu sur fond blanc** en héro, sans ancrage dans une vraie charte. Le logo SJI INNOVA porte déjà un bleu profond, un or et le tricolore camerounais : la charte existe, elle n'est pas exploitée.
2. **Tout centré.** Titre centré, sous-titre centré, deux boutons centrés, cartes centrées. Aucune tension, aucune asymétrie, aucune hiérarchie de lecture.
3. **La grille de trois cartes** répétée en boucle, avec une icône ronde en haut, un titre, deux lignes de texte. Même pattern pour les « valeurs », les « étapes », les « avantages ».
4. **Rythme vertical uniforme.** Chaque section fait la même hauteur, le même padding, le même fond alterné blanc/gris très clair. L'œil ne sait pas où s'arrêter.
5. **Zéro photographie réelle.** Des icônes et des aplats à la place des visages, des projets, du campus. Un concours étudiant sans étudiants à l'écran ne convainc personne.
6. **Typographie par défaut.** Une seule famille (Inter ou système), un seul contraste de graisse, aucun titre travaillé. C'est le signal le plus immédiat du template.
7. **Copie creuse.** Des formules interchangeables (« Révélez votre créativité », « les solutions de demain ») qui pourraient décrire n'importe quel concours sur n'importe quel continent.

**Ce qui manque fonctionnellement**, au-delà de l'esthétique : aucun compte à rebours vers le 18 décembre, aucun parcours de dépôt de dossier, aucune page partenaires alors qu'un dossier de partenariat existe, aucune trace de la 1ʳᵉ édition (projets, lauréats, photos) — or c'est la preuve sociale la plus forte dont dispose le concours, aucun règlement téléchargeable, aucune FAQ.

## Direction artistique : « Le trait qui monte »

Tout vient du logo, et rien ne vient d'ailleurs. Le logo dit déjà quatre choses : l'aigle donne le vol, l'ampoule donne l'idée, la flèche dorée qui traverse le mot INNOVA donne la direction — ça monte —, et l'arc tricolore encadre sans jamais remplir. Le cinquième élément est le moins visible et le plus important : **le logo est posé sur du blanc.** Le site reprend ces cinq gestes et s'interdit tout le reste.

**Le site est clair, et le reste.** Le bleu nuit du logo est une couleur de **texte et de masse**, jamais une couleur de fond général. Il sert au corps de texte, aux titres, et à deux blocs pleins dans toute la page : le bloc d'appel final et le pied de page. Partout ailleurs, le fond est blanc ou blanc bleuté. Ce qui éloigne un site clair du template générique n'est pas l'obscurité, c'est la discipline : trois valeurs de fond seulement, un seul accent doré, des filets bleus visibles au lieu d'ombres floues, une grille délibérément asymétrique, et des titres assez grands pour être des objets graphiques à part entière.

### Les six partis pris

| Parti pris | Traduction concrète | Ce que ça remplace |
| --- | --- | --- |
| Blanc structuré | Trois valeurs de fond seulement — blanc pur, blanc bleuté, bleu très pâle — choisies par fonction, jamais pour alterner mécaniquement | Le fond blanc / gris clair en damier |
| La diagonale dorée | La flèche du logo devient un trait qui traverse la page de bas en haut, se dessine au scroll et relie idée → projet → solution → impact | Des sections empilées sans lien |
| Typographie éditoriale | Un display très lourd à 72–140 px en bleu nuit, un monospace pour dates, numéros et labels | Une seule police, un seul niveau de graisse |
| Grille de bureau d'études | Filets bleus fins et visibles, marges asymétriques, numérotation des sections `01 / 02 / 03` | Le centrage systématique et les ombres portées |
| Chiffres traités comme des objets | 100 000 FCFA, 3 trophées, 2ᵉ édition, le compte à rebours : composés en très grand, jamais noyés dans une phrase | Des cartes-statistiques génériques |
| Vrais visages | Photographies de la 1ʳᵉ édition, traitées en duotone bleu nuit / or, plein cadre | Des icônes rondes à la place des gens |

### Le motif signature

Deux motifs, tirés directement du logo, suffisent à rendre le site reconnaissable. **Les lames d'aile** : trois à cinq formes allongées et légèrement courbes, en `--blue-500` à 6–10 % d'opacité sur le blanc, qui rayonnent derrière les éléments importants — fond de héro, derrière les chiffres clés, derrière la carte du lauréat, en filigrane dans le pied de page. **L'arc** : un cercle ouvert de 1,5 px en `--blue-200`, qui sort toujours du cadre et qu'on ne voit jamais en entier, repris de l'arc qui entoure l'aigle. Les deux restent en arrière-plan, ne sont jamais dorés, et ne portent jamais de texte.

### Le tricolore

Le vert et le rouge de l'arc camerounais ne sont **pas** des couleurs d'interface. Ils ne servent jamais pour un bouton, un lien ou un fond de carte. Ils apparaissent uniquement en filet de 3 à 4 px — comme en bas de chaque page du dossier de partenariat — en bas de la page, en haut du menu mobile ouvert, et en soulignement du mot « camerounais » dans le manifeste. C'est une signature nationale, pas une palette.

### Ce que le site ne fera jamais

- Pas de thème sombre, ni global ni en option. Le bleu nuit ne remplit que le bloc d'appel final et le pied de page.
- Pas de dégradé violet, pas de dégradé multicolore, pas de dégradé sur du texte long.
- Pas de gris neutre : tous les gris du site sont bleutés, dérivés du bleu nuit du logo.
- Pas de carte blanche qui flotte sur une ombre floue. On sépare au filet, pas à l'ombre.
- Pas trois cartes identiques alignées avec une icône ronde en haut.
- Pas de section dont le contenu tient en « Titre, sous-titre, trois puces ».
- Pas d'emoji dans l'interface.
- Pas d'illustration vectorielle d'avatars génériques ni d'images de banque d'images occidentales : les visages sont ceux des étudiants de SJI, ou il n'y a pas de visage.
- Pas d'animation qui bouge sans raison : chaque mouvement sert la métaphore (monter, se dessiner, se révéler).

## Benchmark : à égaler, puis à dépasser

Trois familles de références, chacune pour une raison différente. Les deux premières sont le niveau à atteindre pour être crédible dans la catégorie ; la troisième est ce qui fera sortir le site du lot. Les descriptions ci-dessous sont des repères de direction artistique, pas des relevés datés — l'équipe doit aller voir les sites pour s'en imprégner.

### Famille 1 — Les concours et hackathons étudiants (la catégorie directe)

| Référence | URL | Ce qu'on prend | Ce qu'on laisse |
| --- | --- | --- | --- |
| Hack the North | [hackthenorth.com](https://hackthenorth.com) | Le site est redessiné chaque année autour d'un univers fort ; le compte à rebours et le bouton « Apply » sont traités comme des pièces de design, pas des widgets | Le ton très « geek nord-américain » |
| ETHGlobal | [ethglobal.com](https://ethglobal.com) | La hiérarchie date / lieu / statut sur les cartes d'événement, et la rigueur typographique | La densité d'information, trop élevée pour une 2ᵉ édition |
| HackMIT | [hackmit.org](https://hackmit.org) | Le thème narratif annuel poussé jusque dans les illustrations et le vocabulaire | L'esthétique illustrative enfantine |
| Major League Hacking | [mlh.io](https://mlh.io) | La page « saison » et la liste d'événements filtrable | Le design, daté |
| James Dyson Award | [jamesdysonaward.org](https://jamesdysonaward.org) | La référence absolue sur **la mise en valeur des projets lauréats** : une page par projet, photo plein cadre, problème / solution / prototype | Le blanc clinique |

### Famille 2 — Les écosystèmes innovation et startup (le niveau de finition)

| Référence | URL | Ce qu'on prend |
| --- | --- | --- |
| Slush | [slush.org](https://slush.org) | Le courage typographique : des titres énormes, un seul accent de couleur, aucune carte générique |
| VivaTech | [vivatechnology.com](https://vivatechnology.com) | La page partenaires structurée par niveaux — modèle direct pour Platine / Or / Argent / Bronze |
| Seedstars | [seedstars.com](https://seedstars.com) | Le traitement des villes et des cohortes, pertinent pour une édition annuelle |
| Africa's Business Heroes | [africabusinessheroes.org](https://africabusinessheroes.org) | La preuve qu'un concours africain peut avoir un niveau graphique international sans tomber dans l'imagerie folklorique |
| Tony Elumelu Foundation | [tonyelumelufoundation.org](https://tonyelumelufoundation.org) | Le parcours de candidature en étapes claires, avec statut d'avancement |

### Famille 3 — Le « cran au-dessus » (studios et sites primés)

Ce sont les sites dont il faut voler les **techniques**, pas l'esthétique. On n'imite pas leur univers ; on reprend leur niveau d'exécution.

- **Zentry** — le site qui a inspiré la majorité des tutoriels « award-winning » de 2025 : transitions de sections par masques géométriques, vidéo en arrière-plan de héro qui se révèle au clic. À prendre : le principe de la **transition par forme** entre deux sections, au lieu d'un simple fondu.
- **Studio Freight / darkroom engineering** ([darkroom.engineering](https://darkroom.engineering)) — les auteurs de Lenis. À prendre : le scroll doux comme fondation de tout le reste, et la discipline de performance.
- **Lusion** ([lusion.co](https://lusion.co)) et **Active Theory** ([activetheory.net](https://activetheory.net)) — à prendre : l'idée qu'un site peut avoir **un seul effet signature** exécuté parfaitement, plutôt que dix effets moyens. Pour SJI INNOVA, cet effet unique est la diagonale dorée qui se dessine au scroll.
- **Locomotive** ([locomotive.ca](https://locomotive.ca)) — à prendre : le travail sur les **transitions de page**, qui donnent l'impression d'une application et non d'une suite de pages.
- **14islands** ([14islands.com](https://14islands.com)) — à prendre : le dosage. Beaucoup de blanc tournant, peu d'éléments, chacun parfait.

### Le delta : les cinq choses qu'aucun site de la catégorie ne fait

C'est ici que se gagne le « hors du commun ». Chacune est réalisable sans WebGL ni budget supplémentaire.

1. **Un compte à rebours narratif.** Pas un bloc `JJ : HH : MM : SS`, mais une phrase qui change de ton selon la phase : « Les dépôts ouvrent dans 36 jours » → « Il reste 12 jours pour déposer » → « Le jury délibère » → « La finale, c'est dans 3 jours ». Un seul composant, quatre états pilotés par les dates du calendrier.
2. **La trajectoire du projet dessinée au scroll.** Le diagramme idée → projet → solution → impact du dossier de partenariat devient le fil conducteur vertical du site.
3. **Une page par projet de la 1ʳᵉ édition**, à la Dyson Award. C'est le contenu que personne dans la catégorie locale ne produit, et c'est l'argument n°1 pour les partenaires comme pour les candidats.
4. **Le dossier de partenariat consultable en ligne**, pas seulement en PDF : la page partenaires reprend les quatre niveaux et le bulletin d'engagement devient un formulaire.
5. **Un mode « affiche »** : une page `/affiche` qui rend l'affiche officielle en HTML animé, partageable et imprimable. Coût faible, effet mémorable, et utile pour la communication des étudiants ambassadeurs.

## Charte graphique

La palette est prélevée sur le fichier logo, pas inventée. Elle contient exactement ce que le logo contient : un bleu qui va du nuit au vif, un or, le vert et le rouge de l'arc, et du blanc. Aucune sixième couleur n'est autorisée.

> **À faire avant d'écrire la première ligne de CSS :** ouvrir le logo vectoriel et relever les codes exacts à la pipette. Les valeurs ci-dessous sont lues sur le PNG fourni et sont justes à un ou deux points près ; le fichier source fait foi.

### Palette

| Rôle | Token | Valeur | Où elle est dans le logo | Usage sur le site |
| --- | --- | --- | --- | --- |
| Fond principal | `--paper` | `#FFFFFF` | Le fond du logo | Corps de page |
| Fond alterné | `--paper-2` | `#F4F7FC` | — | Une section sur trois, choisie, pas alternée |
| Surface | `--paper-3` | `#E8EFFB` | — | Cartes, champs, bandes d'accroche |
| Bleu nuit | `--navy-900` | `#0A1F4D` | Le bas du A de INNOVA | Texte principal, pied de page, bloc d'appel final |
| Bleu profond | `--blue-800` | `#0E2A6B` | Le corps du wordmark | Titres display |
| Bleu de marque | `--blue-600` | `#17439B` | Le dégradé médian de l'aile | Liens, états actifs, icônes |
| Bleu vif | `--blue-500` | `#2E6BE6` | La pointe haute de l'aile | Survols, motif d'ailes |
| Bleu pâle | `--blue-200` | `#BBD0F7` | — | Arcs, filets d'accent, bordures fortes |
| Or | `--gold-500` | `#F8A91B` | Le personnage et la flèche | Accent unique : fonds de bouton, diagonale, chiffres clés |
| Or foncé | `--gold-700` | `#B87708` | — | L'or **en texte** sur fond clair, pour le contraste |
| Texte secondaire | `--text-dim` | `#4A5E8A` | — | Paragraphes de soutien, métadonnées |
| Filet | `--line` | `rgba(10,31,77,.12)` | — | Séparateurs, grille, bordures de carte |
| Vert Cameroun | `--cm-green` | `#13A04A` | L'arc, en haut | Filet tricolore uniquement |
| Rouge Cameroun | `--cm-red` | `#D4262C` | L'arc, à droite | Filet tricolore uniquement |

**Piège de contraste à ne pas rater :** `--gold-500` sur blanc tombe à environ 1,9:1, très loin du minimum de 4,5:1. L'or vif est donc une couleur de **surface** — un fond de bouton, un trait, un chiffre très gros — jamais une couleur de petit texte. Pour de l'or en texte, c'est `--gold-700`.

**Règle d'or, à faire respecter en revue :** l'or ne dépasse jamais 10 % de la surface visible d'un écran. Il désigne ce sur quoi on veut que l'œil tombe — un bouton, un chiffre, un mot souligné — jamais un fond de section entier.

### Dégradés autorisés

Trois, pas un de plus.

```css
/* 1. La lueur : un halo très doux derrière UN élément clé, jamais sous une section entière */
--glow-gold: radial-gradient(45% 45% at 50% 50%, rgba(248,169,27,.20) 0%, rgba(248,169,27,0) 70%);

/* 2. Le bloc nuit : réservé au pied de page et au bloc d'appel final */
--navy-block: linear-gradient(140deg, #0E2A6B 0%, #0A1F4D 58%, #17439B 100%);

/* 3. La flèche : le trait doré qui monte, repris du logo */
--arrow: linear-gradient(100deg, #F8A91B 0%, #FFC24A 100%);
```

### Typographie

Trois familles, toutes gratuites et auto-hébergées en `woff2`. Le mélange display lourd + monospace est ce qui, visuellement, tue le plus vite l'impression de template.

| Usage | Police | Source | Graisses à charger |
| --- | --- | --- | --- |
| Display (titres) | **Bricolage Grotesque** | Google Fonts (variable) | 600, 800 |
| Texte courant | **Satoshi** | [Fontshare](https://www.fontshare.com/fonts/satoshi) | 400, 500, 700 |
| Labels, dates, chiffres | **JetBrains Mono** | Google Fonts | 400, 700 |

Si Satoshi pose un problème de licence pour un usage institutionnel, le remplaçant est **Figtree** (Google Fonts). Ne jamais revenir à Inter : c'est la police par défaut de tous les générateurs, et elle signe immédiatement l'origine du design.

### Échelle typographique

Fluide, en `clamp()`, pour éviter toute media query sur la taille du texte.

```css
--fs-display: clamp(3.25rem, 1.2rem + 9vw, 8.75rem);   /* 52 → 140 px */
--fs-h1:      clamp(2.5rem, 1.2rem + 5.4vw, 5rem);     /* 40 → 80 px  */
--fs-h2:      clamp(1.875rem, 1.1rem + 3.2vw, 3.25rem);/* 30 → 52 px  */
--fs-h3:      clamp(1.375rem, 1.05rem + 1.3vw, 1.875rem);
--fs-lead:    clamp(1.0625rem, .98rem + .5vw, 1.375rem);
--fs-body:    1.0625rem;   /* 17 px — plus lisible que 16 sur fond sombre */
--fs-small:   .875rem;
--fs-label:   .75rem;      /* mono, uppercase, letter-spacing .14em */

--lh-display: .92;
--lh-title:   1.06;
--lh-body:    1.65;
--ls-display: -.035em;     /* resserrement obligatoire aux grandes tailles */
--ls-label:   .14em;
```

Règles de composition : les titres display sont en `font-weight: 800`, interlignage inférieur à 1, et **toujours sur deux ou trois lignes** avec une rupture volontaire (`<br>` ou `text-wrap: balance`). Un titre display sur une seule ligne perd tout son effet.

### Grille et espacements

```css
--container: 1320px;
--gutter: clamp(1.25rem, .6rem + 2.6vw, 4rem);
--col: 12;            /* 12 colonnes desktop, 6 tablette, 4 mobile */

--sp-1: .25rem;  --sp-2: .5rem;   --sp-3: .75rem;  --sp-4: 1rem;
--sp-6: 1.5rem;  --sp-8: 2rem;    --sp-12: 3rem;   --sp-16: 4rem;
--sp-24: 6rem;   --sp-32: 8rem;   --sp-40: 10rem;

--section-y: clamp(5rem, 3rem + 8vw, 10rem);
```

Le rythme vertical n'est **pas** uniforme : une section narrative respire à `--sp-40`, une section dense (calendrier, tableau partenaires) à `--sp-24`, une bande d'accroche à `--sp-16`. C'est cette irrégularité qui crée la lecture.

### Rayons, bordures, ombres

```css
--r-sm: 6px;  --r-md: 12px;  --r-lg: 20px;  --r-xl: 32px;  --r-full: 999px;

--border: 1px solid var(--line);
--border-strong: 1px solid #BBD0F7;

/* Sur fond clair, une ombre NOIRE donne un gris sale : les ombres sont teintées en bleu nuit */
--shadow-xs: 0 1px 2px rgba(10,31,77,.06);
--shadow-sm: 0 2px 10px -3px rgba(10,31,77,.10);
--shadow-lg: 0 24px 48px -24px rgba(10,31,77,.22);

/* Les anneaux, préférés aux ombres pour signaler un état */
--ring-gold: 0 0 0 3px rgba(248,169,27,.30);
--ring-blue: 0 0 0 3px rgba(46,107,230,.22);
```

Les ombres sont rares. Par défaut, une carte se sépare du fond **par un filet**, pas par une ombre ; `--shadow-lg` ne sert qu'aux éléments réellement flottants (menu mobile, en-tête condensé, fenêtre modale).

**Pas de `border-radius` partout.** Les cartes de contenu sont à `--r-lg`, les boutons à `--r-full`, les images de projets à `--r-md`, et les blocs « techniques » (calendrier, tableau partenaires) sont **à angles droits** avec un filet. Ce contraste anguleux / arrondi fait partie de la signature.

### Textures

Deux calques discrets, posés en `position: fixed` sur toute la page, `pointer-events: none` :

1. **Grain** — un PNG de bruit 128×128 répété, `opacity: .022`, `mix-blend-mode: multiply`. Sur du blanc il est presque invisible, et c'est exactement le but : il retire le côté « écran d'ordinateur » du blanc pur et donne une matière de papier.
2. **Trame de points** — `radial-gradient(rgba(10,31,77,.09) 1px, transparent 1px)` en `background-size: 32px 32px`, visible uniquement dans le héro et le pied de page. Elle est directement reprise du dossier de partenariat, où elle apparaît en clair sur le bleu ; ici elle est inversée, en bleu sur le blanc.

### Iconographie

**Lucide**, trait 1.5 px, taille 20 ou 24, couleur `--blue-600` par défaut, `--gold-700` à l'état actif. Interdiction formelle de la pastille ronde colorée derrière l'icône : l'icône est posée nue, alignée optiquement sur la première ligne de texte. Les icônes du dossier de partenariat (diplôme, feuille, puce, personnes, graphique ascendant, trophée) donnent le vocabulaire à réutiliser.

### Traitement photo

Toutes les photos de la 1ʳᵉ édition passent par le même traitement, défini une fois en CSS pour rester cohérent même si les sources sont inégales :

```css
.photo-duotone {
  filter: grayscale(1) contrast(1.06);
  background: linear-gradient(0deg, #0A1F4D, #F8A91B);
  background-blend-mode: screen;
  mix-blend-mode: multiply;
}
```

En pratique, le plus fiable est de produire les duotones en amont (un script Sharp ou un preset Photoshop) et de servir des `.avif` déjà traités. Le CSS ci-dessus sert de secours et de guide colorimétrique.

## Design system

Quatorze composants couvrent tout le site. Chacun est un composant Angular standalone, avec ses variantes passées en `input()`. Aucun composant ne doit être écrit deux fois, et aucune section ne doit avoir son CSS propre en dehors de ces primitives.

| Composant | Variantes | Où il sert |
| --- | --- | --- |
| `sji-button` | `primary` (or plein), `ghost` (contour bleu pâle), `link` (souligné animé) | Partout |
| `sji-section-label` | — | L'étiquette mono `01 — LE CONCOURS` en tête de chaque section |
| `sji-display-title` | `xl`, `lg` | Titres de section, héro |
| `sji-stat` | `gold`, `blue` | 100 000 FCFA, 3 trophées, 2ᵉ édition |
| `sji-card` | `project`, `pillar`, `step`, `partner` | Projets, piliers, étapes, logos |
| `sji-timeline` | `vertical`, `horizontal` | Calendrier du concours |
| `sji-countdown` | 4 phases automatiques | Héro, barre collante |
| `sji-tier-table` | — | Comparatif Platine / Or / Argent / Bronze |
| `sji-accordion` | — | FAQ, règlement |
| `sji-field` | `text`, `email`, `tel`, `select`, `file`, `checkbox` | Formulaires dépôt et partenariat |
| `sji-marquee` | `slow`, `fast` | Bande de logos partenaires, bande de mots-clés |
| `sji-reveal` | `fade-up`, `mask`, `stagger` | Directive de révélation au scroll |
| `sji-arrow` | — | La diagonale dorée de fond et sa lueur, pilotées par le scroll |
| `sji-nav` | `top`, `mobile-sheet` | Navigation |

### Boutons

Un seul bouton primaire visible par écran. C'est la règle qui sépare un site conçu d'un site assemblé.

```css
.btn {
  font: 700 1rem/1 'Satoshi', sans-serif;
  padding: 1.0625rem 2rem;
  border-radius: var(--r-full);
  display: inline-flex; align-items: center; gap: .625rem;
  transition: transform .35s cubic-bezier(.2,.8,.2,1),
              box-shadow .35s cubic-bezier(.2,.8,.2,1),
              background-color .25s;
}
.btn--primary {
  background: var(--gold-500); color: var(--navy-900);
  box-shadow: var(--shadow-sm);
}
.btn--primary:hover {
  background: color-mix(in srgb, var(--gold-500) 88%, white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.btn--ghost {
  background: transparent; color: var(--navy-900);
  border: 1px solid var(--blue-200);
}
.btn--ghost:hover { border-color: var(--blue-500); background: rgba(46,107,230,.06); }
.btn:focus-visible { outline: 2px solid var(--gold-700); outline-offset: 3px; }
```

La flèche à droite du bouton primaire se décale de 4 px au survol — c'est le seul micro-mouvement interne autorisé sur un bouton.

### L'étiquette de section

Chaque section s'ouvre par une étiquette monospace en majuscules, précédée d'un filet de 32 px : `— 01 LE CONCOURS`. C'est repris du dossier de partenariat et c'est ce qui donne la cohérence document / site. Elle est en `--blue-300`, `--fs-label`, `letter-spacing: .14em`.

### Cartes

Les cartes ne sont pas des rectangles gris avec une ombre. Spécification commune :

- La carte se distingue du fond **par une valeur, pas par une ombre** : `--paper` sur une section `--paper-2`, `--paper-3` sur une section blanche ;
- filet `--border`, rayon `--r-lg`, **aucune ombre au repos** ;
- au survol : le filet passe à `--blue-500`, un voile `--glow-gold` très diffus apparaît dans le coin haut droit, et la carte monte de 4 px ;
- un numéro d'ordre en monospace dans le coin supérieur droit, en `--blue-200`, taille 40 px ;
- **jamais** d'icône dans une pastille ronde colorée.

La carte `project` est différente : image plein cadre en haut avec ratio 4:3, titre en display, et un seul mot-clé de catégorie en mono. Le texte descriptif n'apparaît qu'au survol, en montant depuis le bas sur un voile dégradé.

### Formulaires

Le champ est le composant le plus souvent raté et le plus vu par les candidats. Spécification :

- label toujours visible au-dessus, en mono `--fs-label`, jamais de placeholder en guise de label ;
- champ sans fond, avec une **bordure basse de 1 px** uniquement, qui passe en `--gold-500` et s'épaissit à 2 px au focus ;
- hauteur 56 px, texte 17 px ;
- erreur : la bordure passe en `--cm-red`, et le message s'affiche sous le champ en 14 px, avec `aria-describedby` ;
- le champ fichier est une zone de dépôt en pointillés qui affiche le nom, le poids et un aperçu dès la sélection.

### États à ne pas oublier

Ce sont eux qui font la différence entre une maquette et un produit. Chacun doit être dessiné avant d'être codé.

- [ ] Chargement initial : fond blanc, le contour de l'ampoule du logo se dessine puis se remplit d'or ; 600 ms maximum, jamais de spinner générique
- [ ] Squelettes de chargement pour la grille de projets
- [ ] État vide : « Les projets de l'édition 2027 seront publiés après la présélection »
- [ ] Erreur réseau avec bouton « Réessayer »
- [ ] Succès d'envoi de formulaire : confirmation plein écran, pas un toast
- [ ] Hors période de dépôt : le bouton principal change de libellé et d'action
- [ ] `prefers-reduced-motion` : toutes les animations réduites à un fondu de 150 ms
- [ ] Page 404 avec le motif d'ailes et un lien de retour

## Architecture de l'information

Cinq rubriques, pas plus. Le site a un objectif principal — faire déposer des dossiers avant le 18 décembre 2026 — et un objectif secondaire — faire signer des partenaires. Tout le reste sert ces deux-là.

&#91;embedded content: arborescence SJI INNOVA 2027 · 5 rubriques, 1 parcours prioritaire\]

Le chemin en couleur est celui qu'on optimise : depuis n'importe quelle page, un candidat doit atteindre le formulaire en un clic.

### Routes Angular

| Route | Page | Ce qu'elle doit obtenir | Priorité |
| --- | --- | --- | --- |
| `/` | Accueil | Comprendre en 10 secondes ce qu'est SJI INNOVA et quand ça se passe | 1 |
| `/deposer` | Déposer un projet | Dossier + vidéo envoyés | 1 |
| `/le-concours` | Le concours | Règlement, critères d'évaluation, composition du jury, FAQ | 2 |
| `/projets` | Projets de la 1ʳᵉ édition | Crédibiliser le concours par la preuve | 2 |
| `/projets/:slug` | Fiche projet | Montrer un projet en détail, donner envie de candidater | 3 |
| `/partenaires` | Devenir partenaire | Bulletin d'engagement rempli ou appel reçu | 2 |
| `/contact` | Contact | Question posée, itinéraire vers Etok-Koss | 3 |
| `/affiche` | Affiche animée | Partage sur les réseaux par les étudiants | 4 |
| `/**` | 404 | Ramener vers l'accueil | 4 |

Les pages de priorité 3 et 4 sont chargées en `loadComponent()` paresseux : elles ne pèsent pas sur le premier chargement.

### Navigation

La barre supérieure est transparente sur le héro, puis se condense au scroll : hauteur 88 px → 64 px, fond `rgba(255,255,255,.85)` avec `backdrop-filter: blur(12px)`, et un filet bas `--line`. À gauche le logo SJI INNOVA en version horizontale, au centre les cinq rubriques en `--navy-900`, à droite un unique bouton `Déposer un projet` en or, accompagné du compte à rebours en mono.

En mobile, un panneau plein écran qui glisse depuis la droite, fond `--paper` avec la trame de points, les cinq rubriques en display 32 px `--navy-900` alignées à gauche et numérotées `01` à `05`, le filet tricolore en haut, le bouton or en bas fixé. Pas de hamburger animé en croix : un simple mot `MENU` / `FERMER` en mono, qui est plus lisible et plus mémorable.

### Les trois publics et leur premier clic

| Public | Ce qu'il cherche | Où le site doit l'envoyer |
| --- | --- | --- |
| Étudiant de SJI | « Est-ce que je peux participer et comment ? » | Héro → `/deposer`, avec les critères visibles avant le formulaire |
| Entreprise ou institution | « Qu'est-ce que j'y gagne et combien ça coûte ? » | Bande partenaires de l'accueil → `/partenaires`, tableau des quatre niveaux |
| Enseignant, parent, presse | « C'est sérieux ? » | Section projets de l'accueil → `/projets`, photos et lauréats de la 1ʳᵉ édition |

## Page d'accueil, section par section

Onze blocs. Chacun a un objectif unique ; si un bloc n'a pas d'objectif, il saute. Le fil rouge est la **diagonale dorée** : elle naît sous le héro, monte de gauche à droite en traversant chaque section, et vient se planter dans le bloc d'appel final. C'est la flèche du logo étirée sur toute la page.

### 00 — Allumage

**Objectif :** masquer le temps de chargement et poser l'univers dès la première seconde.

Écran blanc plein. Au centre, l'ampoule du logo en SVG, contour seul en `--navy-900`, dont le tracé se dessine puis se remplit d'or de bas en haut pendant que les polices chargent. Sous elle, un compteur mono `00 → 100` en `--text-dim`. À 100, l'écran se fend horizontalement en deux et se retire vers le haut et le bas, révélant le héro. **Durée plafonnée à 1 200 ms**, et l'écran se retire dès que les polices sont prêtes même avant la fin. Visible une seule fois par session (`sessionStorage`).

### 01 — Héro

**Objectif :** dire ce que c'est, quand, et quoi faire. En dessous de 10 secondes.

Pleine hauteur (`100svh`, pas `100vh` — à cause de la barre d'URL mobile). Grille 12 colonnes, contenu sur les colonnes 1 à 7, donc **volontairement décalé à gauche**. À droite, colonnes 8 à 12, le motif d'ailes et l'ampoule lumineuse en SVG, avec une parallaxe douce au mouvement de souris (amplitude maximale 12 px).

Ordre vertical : étiquette mono `2ᵉ ÉDITION · YAOUNDÉ · 2027` → titre display sur trois lignes → paragraphe de 2 lignes → deux boutons → compte à rebours.

Le titre reprend l'affiche : **Imaginez. Innover. Construire demain.** Le mot « Innover » reste en `--navy-900` — l'or vif sur blanc n'est pas lisible, et un titre illisible n'est pas un titre — mais il reçoit le soulignement manuscrit de l'affiche, tracé en SVG en `--gold-500`, épaisseur 6 px, qui se dessine en 700 ms au chargement (`stroke-dashoffset`). C'est le trait qui accroche l'œil, pas la couleur de la lettre.

En bas à gauche, un indicateur de scroll : un filet vertical de 48 px où un point doré descend en boucle, et le mot `DÉFILER` en mono vertical.

### 02 — Bande défilante

**Objectif :** transition respirée entre le héro et le contenu, et répétition du positionnement.

Une bande pleine largeur, hauteur 72 px, bordée en haut et en bas d'un filet. Les mots défilent horizontalement en boucle infinie, display 28 px, séparés par un losange doré de 8 px : `CRÉATIVITÉ · INGÉNIOSITÉ · INNOVATION · AU SERVICE DE LA SOCIÉTÉ`. La vitesse s'inverse selon le sens du scroll. Animation en CSS pur (`transform: translate3d`), jamais en JavaScript.

### 03 — Le manifeste

**Objectif :** expliquer ce qu'est le concours, sans la tartine institutionnelle.

Étiquette `— 01 LE CONCOURS`. Un seul paragraphe, mais composé en **gros** : `--fs-h3`, largeur maximale 22 mots par ligne, texte en `--text-dim` avec **les mots-clés en `--navy-900` plein**. Chaque mot important passe du gris bleuté au bleu nuit à mesure qu'il entre dans le viewport : le texte se révèle mot à mot, comme s'il s'encrait.

À droite, en colonne étroite, les trois verbes du dossier de partenariat — **Détecter, Valoriser, Accompagner** — empilés, chacun avec une ligne d'explication. Pas de cartes, juste des filets de séparation.

### 04 — La trajectoire

**Objectif :** montrer la montée idée → projet → solution → impact.

Section pinnée (`ScrollTrigger` avec `pin: true`) sur 300 % de la hauteur d'écran. Quatre paliers montent en diagonale de gauche à droite, exactement comme le graphique du dossier de partenariat. À chaque palier atteint, le palier s'allume en or, son libellé apparaît, et le halo de fond se déplace vers lui. La ligne pointillée qui les relie se dessine au scroll.

En mobile, pas de pin : les quatre paliers deviennent une liste verticale avec la ligne qui se dessine à gauche.

### 05 — Le calendrier

**Objectif :** que la date du 18 décembre 2026 reste en mémoire.

Trois temps forts, en bande horizontale sur desktop, à angles droits et séparés par des filets verticaux :

| Temps fort | Dates | Traitement |
| --- | --- | --- |
| Lancement et dépôt des projets | 16 nov. → 18 déc. 2026 | Filet et numéro en or si la période est en cours |
| Évaluation et présélection | 21 déc. 2026 → 22 janv. 2027 | Neutre, sur `--paper` |
| Grande finale et remise des prix | 10 février 2027, 13h–17h | Fond `--paper-3`, titre plus gros, le plus mis en valeur |

Une barre de progression fine traverse les trois blocs et montre où l'on en est **aujourd'hui**, calculée depuis la date courante. C'est un détail de deux heures de travail qui transforme la perception du site : il est vivant.

### 06 — À gagner

**Objectif :** donner une raison concrète de candidater.

Trois éléments, mais traités en **asymétrie** : le montant occupe deux tiers de la largeur, les deux autres se partagent le tiers restant.

- **100 000 FCFA** — composé en display 140 px, en or, avec le motif d'ailes derrière. Sous le chiffre, en mono : `POUR LE PROJET LAURÉAT`.
- **3 trophées** — pour les meilleurs projets.
- **Un accompagnement** — technique et académique.

Le chiffre s'incrémente de 0 à 100 000 en 1,2 s quand il entre dans le viewport, avec `font-variant-numeric: tabular-nums` pour éviter que la largeur saute.

### 07 — Les projets de la 1ʳᵉ édition

**Objectif :** prouver que le concours existe vraiment et produit des résultats.

C'est la section la plus importante du site et celle qui manque aujourd'hui. Grille asymétrique : la première carte occupe deux colonnes et deux rangées, les suivantes une seule. Image en duotone, titre display, filière et année en mono. Au survol, l'image se désature moins et une ligne de description monte depuis le bas.

Si les photos de la 1ʳᵉ édition sont indisponibles, **ne pas remplir avec des images de banque** : afficher les projets en cartes typographiques, fond `--paper-3`, le nom du projet en display 40 px en `--navy-900` occupant toute la carte. C'est plus honnête et, graphiquement, plus fort.

### 08 — Qui peut participer

**Objectif :** lever les doutes avant le formulaire.

Accordéon sobre, cinq entrées maximum : conditions d'éligibilité, pièces à fournir (dossier + vidéo), critères d'évaluation du jury, calendrier détaillé, questions pratiques. Chaque entrée ouverte révèle son contenu avec un déroulé en hauteur de 400 ms, et le signe `+` pivote en `×`.

À droite de l'accordéon, une carte collante avec le bouton `Déposer mon projet` et le nombre de jours restants.

### 09 — Partenaires

**Objectif :** capter les entreprises de passage et rassurer les candidats.

Deux parties. En haut, une bande de logos partenaires en défilement lent, logos en nuances de `--navy-900` à 45 % d'opacité, passant à 100 % et en couleur au survol — un logo monochrome sur blanc se lit, un logo blanc sur blanc non. En bas, un bloc d'appel sur `--paper-2` : étiquette `— 05 PARTENARIAT`, titre **Faites rayonner le génie étudiant**, les quatre niveaux cités en une ligne, et un bouton fantôme `Voir le dossier de partenariat`.

Tant qu'il n'y a pas de partenaire confirmé, la bande de logos est remplacée par une phrase : « Les partenaires de l'édition 2027 seront annoncés ici. » Jamais de logos fictifs ni de cases grises.

### 10 — Appel final

**Objectif :** dernier déclencheur avant le pied de page.

Pleine hauteur, et **le seul grand aplat bleu nuit de la page** : fond `--navy-block`, trame de points en clair, motif d'ailes derrière. Après dix sections sur blanc, ce basculement fait l'effet d'un coup de projecteur — c'est précisément pour ça qu'il faut l'économiser. Au centre, la diagonale dorée arrive et se plante. Titre display en blanc, centré : c'est le seul centrage de toute la page, et c'est ce qui le rend remarquable. **Ensemble, donnons des ailes à l'innovation.** Dessous, le compte à rebours en version grande, puis le bouton or.

### 11 — Pied de page

Quatre colonnes : identité (logo, baseline, Campus d'Etok-Koss, Yaoundé), navigation, contacts (les trois numéros du dossier : 694 88 23 94, 656 03 32 52, 655 66 03 95), réseaux (@SJI\_INNOVA sur Facebook, @sji\_innova sur Instagram, @SJI INNOVA sur LinkedIn, et le mot-dièse `#SJIINNOVA2027`).

En bas, sur toute la largeur, le filet tricolore de 4 px — vert, rouge, or — exactement comme en pied de page du dossier de partenariat. C'est la signature qui ferme le site.

## Pages secondaires

Toutes les pages partagent la même ouverture : un en-tête de 320 px de haut, fond `--paper-2` avec la trame de points et un arc bleu pâle qui sort du cadre, l'étiquette mono de la rubrique, le titre display en `--navy-900`, et le filet tricolore en bas de l'en-tête. Cette répétition est ce qui fait tenir un site ; seul le contenu change.

### `/deposer` — Déposer un projet

La page la plus importante et celle où la plupart des sites de concours échouent. Règle : **un seul champ demandé à la fois n'est pas la bonne réponse, mais un formulaire de 25 champs non plus.** Quatre étapes, barre de progression permanente en haut, sauvegarde automatique en `localStorage` à chaque changement de champ.

| Étape | Champs | Pourquoi ici |
| --- | --- | --- |
| 1. L'équipe | Nom du projet, nom du porteur, filière, niveau, téléphone, e-mail, membres de l'équipe (ajout dynamique) | Les informations faciles d'abord, pour créer l'engagement |
| 2. Le projet | Problème traité (800 caractères), solution proposée (1 200), état d'avancement (idée / prototype / testé), domaine | Le cœur du dossier |
| 3. Les pièces | Dossier PDF, vidéo (fichier ou lien YouTube), images facultatives | Les pièces lourdes en avant-dernier, jamais en premier |
| 4. Relecture | Récapitulatif complet modifiable, case d'acceptation du règlement | La dernière chance de corriger |

Contraintes à respecter : compteur de caractères visible sous les champs longs ; le téléversement affiche une vraie barre de progression et le poids ; les fichiers acceptés et leur limite sont annoncés **avant** la sélection ; le bouton de l'étape suivante reste désactivé et explique ce qui manque au survol.

L'écran de confirmation est plein page : un numéro de dossier en display, un rappel de la date de présélection, et un bouton de partage pré-rempli pour les réseaux. Un e-mail de confirmation part en parallèle.

Hors période de dépôt, la page affiche un état dédié : avant le 16 novembre, un formulaire d'alerte par e-mail ; après le 18 décembre, un renvoi vers la page projets et le calendrier de présélection.

### `/le-concours` — Le concours

Quatre blocs : le texte de présentation issu du dossier de partenariat, les critères d'évaluation du jury présentés en barème (un tableau critère / poids, à faire valider par le comité d'organisation), le calendrier détaillé, et la FAQ en accordéon. Un bouton permanent de téléchargement du règlement en PDF.

Si le barème n'est pas encore arrêté, ne pas inventer de pourcentages : lister les critères sans pondération et ajouter la mention « barème détaillé publié avec le règlement ».

### `/projets` et `/projets/:slug`

La page liste filtre par édition, par domaine et par filière, avec les filtres en chips mono en haut. La fiche projet suit le modèle du James Dyson Award : image plein cadre, puis quatre blocs — le problème, la solution, le prototype, l'équipe — chacun avec une image, et enfin un lien de retour vers la liste.

Les données viennent d'un fichier JSON en `assets/data/projets.json` tant qu'il n'y a pas de back-office. Le modèle de données doit être défini dès maintenant pour ne pas refaire le travail : `slug`, `titre`, `edition`, `domaine`, `filiere`, `porteurs[]`, `resume`, `probleme`, `solution`, `prototype`, `images[]`, `prix` (facultatif).

### `/partenaires` — Devenir partenaire

C'est la traduction web du dossier de partenariat. Cinq blocs, dans cet ordre exact :

1. Les cinq raisons de devenir partenaire, en liste numérotée avec un filet entre chaque — pas en cartes.
2. Le schéma des quatre publics réunis (étudiants, enseignants, partenaires académiques, acteurs socio-économiques), repris du dossier en SVG animé.
3. Les quatre formes de contribution : financière, matérielle, technique, institutionnelle.
4. **Le tableau des niveaux** — Platine, Or, Argent, Bronze — avec les contreparties ligne par ligne. En mobile, il devient quatre cartes empilées, jamais un tableau à défilement horizontal. La mention « contreparties indicatives, ajustables avec le comité d'organisation » reste visible.
5. Le bulletin d'engagement en formulaire : structure, représentant, fonction, téléphone, e-mail, formule souhaitée, nature de la contribution. L'envoi génère un PDF pré-rempli que le partenaire peut signer et retourner.

Un bouton secondaire télécharge le dossier PDF complet, pour ceux qui veulent le transmettre en interne.

### `/contact`

Trois numéros cliquables en `tel:`, un bouton WhatsApp direct — c'est le canal réel au Cameroun, l'ignorer serait une erreur —, un formulaire court (nom, qualité, message), et une carte d'accès au campus d'Etok-Koss avec un lien d'itinéraire. La carte est une image statique avec un lien, pas une iframe Google Maps : une iframe coûte plus de 500 Ko et bloque le rendu.

### `/affiche`

L'affiche officielle recomposée en HTML, au format portrait, animée au chargement, avec un bouton de téléchargement en PNG et un bouton de partage. Coût : une demi-journée. Utilité : chaque étudiant ambassadeur a un lien à partager au lieu d'une image compressée par WhatsApp.

## Contenu rédactionnel

Le texte ci-dessous est prêt à être posé dans le code. Il est à faire valider par le comité d'organisation, mais il tient déjà le niveau : phrases courtes, aucune formule creuse, chaque mot vérifiable dans le dossier de partenariat.

**La règle de voix :** on s'adresse à l'étudiant au tutoiement du collectif (« vous »), jamais au « nous » institutionnel en début de phrase. On dit ce qui se passe et quand, pas ce qu'on « a à cœur de ».

### Héro

> **Étiquette** — `2ᵉ ÉDITION · SAINT JEAN INGÉNIEUR · YAOUNDÉ`
>
> **Titre** — Imaginez. *Innover.* Construire demain.
>
> **Accroche** — Le concours d'innovation étudiante de Saint Jean Ingénieur revient pour sa deuxième édition. Déposez votre projet avant le 18 décembre 2026.
>
> **Bouton principal** — Déposer mon projet
>
> **Bouton secondaire** — Voir le règlement

### Compte à rebours, les quatre états

| Phase | Déclencheur | Texte |
| --- | --- | --- |
| Avant ouverture | avant le 16 nov. 2026 | Les dépôts ouvrent dans **{n} jours** |
| Dépôts ouverts | 16 nov. → 18 déc. 2026 | Il vous reste **{n} jours** pour déposer |
| Évaluation | 21 déc. → 22 janv. 2027 | Le jury évalue les projets. Résultats le 22 janvier. |
| Vers la finale | après le 22 janv. 2027 | La grande finale, c'est dans **{n} jours** |
| Après la finale | après le 10 fév. 2027 | Édition 2027 terminée. Découvrez les lauréats. |

### Manifeste

> **Étiquette** — `— 01 LE CONCOURS`
>
> SJI INNOVA récompense les projets d'étudiants qui répondent à un besoin réel de la société camerounaise. Pas une idée sur papier : un problème identifié, une solution construite, un prototype qu'on peut montrer. La première édition a fait émerger plusieurs projets portés par des étudiants ; la deuxième en fait un rendez-vous annuel.

Les trois verbes, avec leur ligne :

- **Détecter** — Repérer les idées et les talents capables de répondre à de vrais besoins.
- **Valoriser** — Donner de la visibilité aux projets et récompenser les meilleurs lors d'une grande cérémonie.
- **Accompagner** — Offrir aux jeunes innovateurs un accompagnement à la hauteur de leurs ambitions.

### Trajectoire

> **Étiquette** — `— 02 LE PARCOURS`
>
> **Titre** — D'une idée à un impact.
>
> `IDÉE` : Vous repérez un problème que personne autour de vous n'a résolu. `PROJET` : Vous le structurez, seul ou en équipe, et vous le déposez. `SOLUTION` : Le jury évalue, présélectionne, et vous accompagne. `IMPACT` : Votre projet quitte le campus et sert.

### Calendrier

> **Étiquette** — `— 03 LE CALENDRIER`
>
> **Titre** — Trois temps forts, un seul objectif : la finale.
>
> **Lancement et dépôt** · 16 novembre → 18 décembre 2026 · Remise des dossiers et de la vidéo de présentation. **Évaluation et présélection** · 21 décembre 2026 → 22 janvier 2027 · Le jury d'évaluation examine les dossiers. **Grande finale et remise des prix** · 10 février 2027, 13h–17h · Grande salle Licence 1 francophone, campus d'Etok-Koss.

### À gagner

> **Étiquette** — `— 04 À GAGNER`
>
> **100 000 FCFA** pour le projet lauréat. **3 trophées** pour les meilleurs projets. **Un accompagnement** technique et académique pour aller plus loin.

### Projets

> **Étiquette** — `— 05 LES PROJETS`
>
> **Titre** — Ils l'ont déjà fait.
>
> **Accroche** — Les projets de la première édition, portés par des étudiants de Saint Jean Ingénieur.
>
> **État vide** — Les projets de l'édition 2027 seront publiés après la présélection, en janvier.

### Partenaires

> **Étiquette** — `— 06 PARTENARIAT`
>
> **Titre** — Faites rayonner le génie étudiant.
>
> **Accroche** — Associez votre marque à la créativité de la jeunesse camerounaise. Quatre niveaux d'engagement, et un format sur mesure si aucun ne vous correspond.
>
> **Bouton** — Voir le dossier de partenariat

### Appel final

> **Titre** — Ensemble, donnons des ailes à l'innovation.
>
> **Accroche** — Les dépôts ferment le 18 décembre 2026. Après, il faudra attendre l'édition suivante.
>
> **Bouton** — Déposer mon projet

### Microcopy

Les petits textes sont ce qui distingue un produit fini d'une maquette. Ceux-ci sont à reprendre tels quels.

| Endroit | Texte |
| --- | --- |
| Champ vidéo | Fichier MP4 de 200 Mo maximum, ou un lien YouTube ou Google Drive accessible |
| Champ dossier | PDF de 10 Mo maximum. Modèle de dossier à télécharger ici. |
| Bouton désactivé | Complétez le nom du projet et votre filière pour continuer |
| Erreur réseau | L'envoi n'a pas abouti. Votre dossier est enregistré sur cet appareil — réessayez. |
| Succès | Dossier reçu. Votre numéro est **{num}**. Notez-le, il vous sera demandé. |
| 404 | Cette page n'existe pas. Mais le concours, si. |
| Chargement projets | Chargement des projets de la première édition… |

### Métadonnées de la page d'accueil

> **title** — SJI INNOVA 2027 · Concours d'innovation étudiante · Saint Jean Ingénieur, Yaoundé
>
> **description** — 2ᵉ édition du concours d'innovation étudiante de Saint Jean Ingénieur. Dépôt des projets du 16 novembre au 18 décembre 2026, grande finale le 10 février 2027 à Yaoundé. 100 000 FCFA et un accompagnement pour le projet lauréat.

## Direction motion

Le mouvement est ce qui sépare le plus nettement un site de studio d'un site de template — et c'est aussi ce qui rate le plus souvent. Deux principes :

1. **Un seul effet signature.** Ici c'est la diagonale dorée qui se dessine au scroll. Tout le reste est du mouvement de service : révéler, souligner, transitionner.
2. **Le mouvement répond au geste.** Rien ne bouge tout seul en boucle, sauf la bande défilante et le point de l'indicateur de scroll.

### Courbes et durées

```css
--ease-out:  cubic-bezier(.22, 1, .36, 1);     /* entrées, révélations */
--ease-soft: cubic-bezier(.4, 0, .2, 1);        /* survols, états */
--ease-in-out: cubic-bezier(.65, 0, .35, 1);    /* transitions de page */

--d-fast: 180ms;   /* changement d'état : couleur, opacité */
--d-base: 420ms;   /* révélation d'élément */
--d-slow: 700ms;   /* révélation de bloc, dessin de tracé */
--d-page: 900ms;   /* transition entre pages */
```

Règle de proportion : plus l'élément est grand, plus il est lent. Un bouton change d'état en 180 ms, un titre display se révèle en 700 ms. L'inverse donne l'impression de bâclé.

### Le catalogue des mouvements

| Mouvement | Où | Comment |
| --- | --- | --- |
| Révélation par masque | Titres display | `clip-path: inset(100% 0 0 0)` → `inset(0)`, décalé de 60 ms par ligne |
| Montée en cascade | Paragraphes, listes, cartes | `translateY(24px)` + opacité, décalage 80 ms entre éléments |
| Dessin de tracé | Diagonale dorée, soulignement « Innover », arcs, filets | `stroke-dashoffset` de la longueur à 0 |
| Encrage | Manifeste | Chaque mot passe de `--text-dim` à `--navy-900` à son entrée |
| Comptage | 100 000 FCFA, compte à rebours | Interpolation sur 1 200 ms, `tabular-nums` |
| Parallaxe | Ampoule et ailes du héro, images de projets | `translateY` de ±8 % maximum, lié au scroll |
| Lueur | Derrière l'élément clé de la section active | Position du gradient radial interpolée, amortissement 0,08 |
| Épinglage | Section trajectoire | `ScrollTrigger` `pin`, 300 % de hauteur |
| Magnétisme | Bouton principal uniquement | Le bouton suit le curseur de 6 px maximum dans un rayon de 80 px |
| Transition de page | Entre les routes | Un voile `--navy-900` monte, la nouvelle page se révèle, 900 ms |

### L'effet signature, en détail

L'effet signature est **la diagonale dorée** : un unique `<path>` SVG en `position: fixed`, `pointer-events: none`, `z-index: 0`, qui traverse toute la hauteur de la fenêtre en montant de gauche à droite, tracé en `--arrow`, épaisseur 3 px. Son `stroke-dashoffset` est lié à la progression du scroll : le trait se dessine exactement au rythme de la lecture, et arrive à son extrémité au moment où le lecteur atteint le bloc d'appel final.

Une lueur dorée l'accompagne, centrée sur l'élément clé de la section active. Elle reste **très discrète** : sur fond blanc, une lueur au-dessus de 20 % d'opacité vire au jaune sale. Deux variables CSS pilotent sa position :

```ts
// Mise à jour dans un unique rAF, jamais dans l'événement scroll
const target = { x: 50, y: 0, intensity: .22 };
const current = { ...target };

function frame() {
  current.x += (target.x - current.x) * .08;
  current.y += (target.y - current.y) * .08;
  current.intensity += (target.intensity - current.intensity) * .08;
  root.style.setProperty('--glow-x', `${current.x}%`);
  root.style.setProperty('--glow-y', `${current.y}%`);
  root.style.setProperty('--glow-i', `${current.intensity}`);
  requestAnimationFrame(frame);
}
```

Chaque section déclare sa cible en attribut (`data-glow="50 20 .18"`). Un `ScrollTrigger` par section met à jour `target`. Le résultat : la lumière se déplace de façon continue et jamais saccadée, et la page a l'air d'être un seul objet.

### Les interdits

- Pas de `scroll-behavior: smooth` natif **en plus** de Lenis : les deux se battent.
- Pas d'animation sur `width`, `height`, `top`, `left`, `margin` : uniquement `transform` et `opacity`.
- Pas de `will-change` permanent : ajouté avant l'animation, retiré après.
- Pas de curseur personnalisé qui remplace le curseur système. Un cercle qui suit la souris est le cliché le plus daté de la catégorie.
- Pas de son.
- Pas de défilement horizontal forcé sur mobile.

### Mouvement réduit

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Et côté TypeScript : Lenis désactivé, `ScrollTrigger` réduit aux simples apparitions en opacité, parallaxe et magnétisme coupés, épinglage remplacé par un empilement normal. Ce n'est pas une option : un site primé qui ignore ce réglage perd son badge d'accessibilité.

## Stack et implémentation Angular

On garde Angular — il n'y a aucune raison de tout réécrire — mais on ajoute les trois pièces qui manquent : le rendu côté serveur, le scroll fluide, et un moteur d'animation sérieux.

### Dépendances

| Paquet | Rôle | Note |
| --- | --- | --- |
| `@angular/ssr` | Prerender statique des routes | Le gain le plus important du chantier |
| `gsap` | Animations et `ScrollTrigger` | `ScrollTrigger` est dans le cœur ; vérifier la licence courante avant d'utiliser `SplitText` |
| `lenis` | Scroll fluide | Paquet `lenis`, pas l'ancien `@studio-freight/lenis` |
| `tailwindcss` | Utilitaires, avec les tokens de la charte en thème | Facultatif mais recommandé : évite 2 000 lignes de SCSS |
| `lucide-angular` | Icônes | Trait 1.5, taille 20/24 |
| `@angular/forms` | Formulaires réactifs du dépôt | Déjà présent |

À ne **pas** ajouter : aucune bibliothèque de composants UI (Material, PrimeNG, Bootstrap). Elles imposent leur esthétique et ramènent exactement le problème qu'on cherche à résoudre.

### Structure de dossiers

```
src/
  app/
    core/
      services/      lenis.service.ts, glow.service.ts, seo.service.ts, concours-dates.service.ts
      directives/    reveal.directive.ts, parallax.directive.ts, magnetic.directive.ts
    shared/
      ui/            button, section-label, display-title, stat, card, field,
                     accordion, marquee, countdown, tier-table
      layout/        header, footer, mobile-nav, glow-layer, grain-layer
    pages/
      home/          sections/ (hero, manifeste, trajectoire, calendrier,
                     gains, projets, faq, partenaires, cta)
      deposer/       steps/ (equipe, projet, pieces, relecture), confirmation
      concours/  projets/  partenaires/  contact/  affiche/  not-found/
  assets/
    fonts/   data/   images/   patterns/
  styles/
    _tokens.scss   _typography.scss   _base.scss   _utilities.scss
```

Une section de la page d'accueil = un composant standalone. Jamais un `home.component.html` de 900 lignes : c'est la garantie que personne ne pourra plus rien modifier dans trois mois.

### Rendu côté serveur

Le plus gros gain du chantier, et le moins visible.

```bash
ng add @angular/ssr
```

Toutes les routes publiques sont **prerendues** à la compilation : `/`, `/le-concours`, `/projets`, chaque `/projets/:slug` depuis le JSON, `/partenaires`, `/contact`, `/affiche`. Seule `/deposer` peut rester en rendu client, puisqu'elle n'a aucun intérêt pour l'indexation.

Vercel sert alors du HTML complet : premier pixel utile immédiat, indexation correcte, aperçus de partage fonctionnels. Attention au code qui touche `window` ou `document` — tout le code d'animation doit être gardé par `afterNextRender()` ou `isPlatformBrowser()`.

### Le service Lenis

```ts
@Injectable({ providedIn: 'root' })
export class LenisService {
  private lenis?: Lenis;

  init(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => this.lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  stop(): void { this.lenis?.stop(); }   // ouverture du menu mobile, modales
  start(): void { this.lenis?.start(); }
  destroy(): void { this.lenis?.destroy(); this.lenis = undefined; }
}
```

Appelé une seule fois dans `AppComponent`, sous `afterNextRender()`. Les éléments à défilement natif — un tableau en mobile, le panneau de menu — portent l'attribut `data-lenis-prevent`.

### La directive de révélation

Une directive unique couvre 90 % des animations du site, ce qui évite d'écrire du GSAP dans chaque composant.

```ts
@Directive({ selector: '[sjiReveal]', standalone: true })
export class RevealDirective {
  private el = inject(ElementRef<HTMLElement>);
  readonly mode = input<'fade-up' | 'mask' | 'stagger'>('fade-up');
  readonly delay = input(0);

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const node = this.el.nativeElement;
      const targets = this.mode() === 'stagger'
        ? node.children
        : node;

      gsap.from(targets, {
        y: this.mode() === 'mask' ? 0 : 24,
        clipPath: this.mode() === 'mask' ? 'inset(100% 0 0 0)' : undefined,
        opacity: this.mode() === 'mask' ? 1 : 0,
        duration: .7,
        delay: this.delay(),
        stagger: this.mode() === 'stagger' ? .08 : 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 82%', once: true },
      });
    });
  }
}
```

### Le service des dates

Tout ce qui dépend du calendrier passe par un service unique, avec les dates en constantes. C'est ce qui permet au site de changer de phase tout seul, sans intervention le 19 décembre au matin.

```ts
export const DATES = {
  ouverture:   new Date('2026-11-16T00:00:00+01:00'),
  cloture:     new Date('2026-12-18T23:59:59+01:00'),
  evalDebut:   new Date('2026-12-21T00:00:00+01:00'),
  evalFin:     new Date('2027-01-22T23:59:59+01:00'),
  finale:      new Date('2027-02-10T13:00:00+01:00'),
} as const;

export type Phase = 'avant' | 'depots' | 'evaluation' | 'vers-finale' | 'apres';
```

Le service expose un `signal<Phase>` et un `computed()` pour le nombre de jours restants. Le compte à rebours, le libellé du bouton principal, l'état de `/deposer` et la barre de progression du calendrier en découlent tous.

> **Note horaire :** le Cameroun est en UTC+01:00 toute l'année. Les dates sont écrites avec ce décalage explicite pour qu'un visiteur à Paris en été ne voie pas un jour de décalage.

### Polices

Auto-hébergées dans `assets/fonts`, format `woff2` uniquement, `font-display: swap`, et préchargement des deux fichiers critiques :

```html
<link rel="preload" as="font" type="font/woff2"
      href="/assets/fonts/BricolageGrotesque-Variable.woff2" crossorigin>
```

Sous-réglage latin + latin-ext pour garder les caractères accentués français. Un `size-adjust` sur la police de secours évite le saut de mise en page au chargement.

### Images

Format `avif` avec repli `webp`, servies en `<picture>`, trois largeurs (640, 1280, 1920), `loading="lazy"` sauf la première image du héro, et `width`/`height` toujours renseignés pour réserver la place. Le composant `NgOptimizedImage` d'Angular fait ce travail correctement — l'utiliser plutôt que de réécrire la logique.

## Performance, accessibilité, responsive

C'est la partie qui décide si le site est réellement bon ou seulement joli en capture d'écran. Le public cible est majoritairement sur Android d'entrée de gamme, en 3G ou 4G instable, avec un forfait data compté. Un site de 6 Mo est un site que personne ne verra.

### Budget de performance

À vérifier à chaque mise en production, pas une fois à la fin.

| Mesure | Cible | Plafond absolu |
| --- | --- | --- |
| Poids total de la page d'accueil | 900 Ko | 1,5 Mo |
| JavaScript (compressé) | 180 Ko | 280 Ko |
| Polices | 3 fichiers, 120 Ko | 160 Ko |
| Image du héro | 90 Ko en AVIF | 150 Ko |
| LCP sur 4G simulée | < 2,0 s | 2,5 s |
| CLS | 0 | 0,05 |
| INP | < 150 ms | 200 ms |
| Lighthouse mobile, performance | ≥ 92 | 85 |

Les leviers, par ordre d'efficacité : prerender, AVIF, chargement paresseux des routes secondaires, GSAP importé en modules (`gsap/ScrollTrigger` séparément, jamais le bundle complet), et suppression de toute police non utilisée.

### Le mode économie

Un détail qui compte localement : détecter `navigator.connection.saveData` ou un `effectiveType` en `2g`/`3g`, et servir alors une version allégée — pas de parallaxe, pas de halo animé, images en `webp` basse résolution, écran d'allumage sauté. Le site reste identique en structure et en charte ; il perd seulement ses effets. Trente lignes de code pour un site utilisable à Ngaoundéré comme à Yaoundé.

### Points de rupture

| Nom | Largeur | Grille | Particularité |
| --- | --- | --- | --- |
| `sm` | < 640 px | 4 colonnes | Titre display plafonné à 44 px, pas de pin, pas de parallaxe |
| `md` | 640–1023 px | 6 colonnes | Grilles de cartes en 2 colonnes |
| `lg` | 1024–1439 px | 12 colonnes | Mise en page complète |
| `xl` | ≥ 1440 px | 12 colonnes, conteneur 1320 px | Marges latérales qui respirent |

Le site est conçu **en commençant par le mobile**. En pratique, cela veut dire que les maquettes à 390 px sont faites et validées avant celles à 1440 px, et non l'inverse. Un héro pensé en desktop puis compressé donne toujours un mobile médiocre.

### Accessibilité

Objectif WCAG 2.2 niveau AA. Les points qui posent réellement problème sur un site sombre et animé :

- **Contraste.** `--navy-900` sur blanc dépasse largement 7:1, donc le corps de texte n'est pas un sujet. Les deux vrais points de vigilance sont `--text-dim` sur `--paper-3`, et surtout l'or : `--gold-500` sur blanc tombe sous 2:1 et n'est **jamais** une couleur de texte. Pour du texte doré, `--gold-700`, et à vérifier au contrôleur.
- **Le texte sur l'or.** Le texte posé sur un bouton or doit être `--navy-900`, jamais blanc.
- **Focus visible.** Un contour `--gold-700` de 2 px avec 3 px de décalage, sur tous les éléments interactifs. Ne jamais faire `outline: none` sans remplacement.
- **Le bloc nuit.** Dans le bloc d'appel final et le pied de page, les couleurs s'inversent : le texte passe en blanc et l'or redevient utilisable en texte. Ces deux blocs se vérifient séparément.
- **Navigation au clavier.** Tout le parcours de dépôt doit être franchissable au clavier seul, y compris le téléversement de fichier.
- **Lien d'évitement** vers le contenu principal, en premier élément du DOM.
- **Hiérarchie des titres** : un seul `h1` par page, pas de saut de niveau.
- **Les animations de révélation ne cachent jamais le contenu.** Le texte est présent dans le DOM et lisible même si le JavaScript échoue : l'état initial est appliqué par GSAP, pas par le CSS. Un `.reveal { opacity: 0 }` en CSS est une faute — si le script ne charge pas, la page est blanche.
- **Champs de formulaire** avec `label` associé, `aria-describedby` pour les erreurs, et `aria-live="polite"` sur le résumé d'erreurs.
- **Le défilement infini de la bande** porte `aria-hidden="true"` : c'est de la décoration.

### Compatibilité

Chrome Android et Chrome desktop en priorité, Safari iOS ensuite, Firefox en vérification. Les points à tester spécifiquement : `backdrop-filter` sur Android ancien (prévoir un fond opaque de repli), `100svh` (repli `100vh`), et `clip-path` animé sur Safari.

## SEO, partage et mesure

Le site actuel est invisible pour les moteurs et ses aperçus de partage sont faux. Trois corrections suffisent à renverser la situation : le prerender (déjà traité), des métadonnées propres par page, et des données structurées.

### Métadonnées par page

Un `SeoService` applique le titre, la description et les balises Open Graph à chaque changement de route, via `Title` et `Meta` d'Angular. Les valeurs sont déclarées dans les `data` de chaque route, pas dispersées dans les composants.

À corriger en priorité par rapport à l'existant :

- toutes les occurrences de **2026** deviennent **2027** ;
- `og:url` pointe vers le domaine définitif, plus vers `campus-event-three.vercel.app` ;
- `og:image` devient un visuel dédié en 1200 × 630, pas le logo détouré ;
- la mention « Université Saint Jean Ingénieur » est remplacée par la dénomination exacte retenue par l'établissement ;
- `canonical` déclaré sur chaque page.

### L'image de partage

C'est le format le plus vu du site : chaque lien envoyé sur WhatsApp l'affiche. C'est aussi **la seule exception à la règle du thème clair**, et pour une raison pratique : une vignette blanche disparaît dans un fil de discussion, une vignette bleu nuit s'y détache. Spécification : 1200 × 630, fond `--navy-block`, trame de points, le logo SJI INNOVA en haut à gauche, le titre **SJI INNOVA 2027** en display blanc, la ligne `DÉPÔTS JUSQU'AU 18 DÉCEMBRE 2026` en mono doré, l'ampoule lumineuse à droite, le filet tricolore en bas. Une variante par page principale (concours, projets, partenaires), et une variante par projet sur les fiches.

### Données structurées

Un bloc JSON-LD dans l'en-tête de la page d'accueil, de type `Event`. Il permet d'apparaître dans les résultats enrichis de Google pour les recherches d'événements à Yaoundé.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "SJI INNOVA 2027 — Concours d'innovation étudiante",
  "startDate": "2026-11-16",
  "endDate": "2027-02-10T17:00+01:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Saint Jean Ingénieur, campus d'Etok-Koss",
    "address": { "@type": "PostalAddress", "addressLocality": "Yaoundé", "addressCountry": "CM" }
  },
  "organizer": { "@type": "Organization", "name": "Saint Jean Ingénieur" }
}
```

### Mots-clés visés

Le volume de recherche est faible, donc l'objectif n'est pas le référencement de masse mais d'être **premier sur son propre nom** et visible sur quelques requêtes locales : `SJI INNOVA`, `concours innovation étudiante Cameroun`, `concours étudiant Yaoundé 2027`, `Saint Jean Ingénieur concours`, `Etok-Koss innovation`. Chacune doit apparaître naturellement dans un titre ou un paragraphe, jamais en liste cachée.

### Fichiers techniques

`robots.txt` autorisant tout et pointant vers `sitemap.xml` ; `sitemap.xml` généré à la compilation depuis la liste des routes prerendues ; `site.webmanifest` avec les icônes 192 et 512, `background_color: #FFFFFF` et `theme-color: #FFFFFF` — la barre du navigateur doit suivre le thème clair du site ; favicon en SVG, avec repli PNG.

### Mesure

Plausible ou Umami plutôt que Google Analytics : moins de 2 Ko, pas de bandeau cookies à gérer, et suffisant pour ce besoin. Les six événements à suivre :

1. Clic sur `Déposer mon projet`, avec la section d'origine
2. Ouverture du formulaire
3. Passage de chaque étape (1 → 2 → 3 → 4), pour repérer où les candidats abandonnent
4. Dépôt terminé
5. Clic sur `Voir le dossier de partenariat` et envoi du bulletin
6. Téléchargement du règlement

L'étape 3 est la plus utile : elle dira, en janvier, s'il faut raccourcir le formulaire pour l'édition suivante.

## Dépôts GitHub de référence

Un avertissement d'abord : **la quasi-totalité des dépôts de cette catégorie sont en React ou Next.js.** C'est normal, c'est l'écosystème des studios créatifs. On ne les copie pas, on y lit les techniques — timelines GSAP, déclencheurs de scroll, transitions par masque — et on les transpose en directives et services Angular. Les trois quarts du code intéressant dans ces dépôts est du JavaScript d'animation, totalement indépendant du framework.

Les dépôts bougent : vérifier la date du dernier commit avant de s'appuyer sur l'un d'eux.

### Fondations à installer

| Dépôt | Ce qu'on en fait |
| --- | --- |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | Le scroll fluide du site. Le README contient l'intégration exacte avec `ScrollTrigger` et la liste des pièges — scroll imbriqué, iframes, `scroll-snap`. À lire en entier avant d'écrire le service. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | Le moteur d'animation. Les exemples de `ScrollTrigger` dans le dépôt sont la meilleure documentation du pin et du scrub. |
| [argyleink/open-props](https://github.com/argyleink/open-props) | Une bibliothèque de variables CSS. On n'en installe pas le paquet : on lit comment ses échelles d'espacement, d'ombres et de courbes sont construites, et on applique la méthode à nos propres tokens. |
| [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | Les icônes, version Angular incluse. |
| [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) | Pour bloquer la mise en production si le budget de performance est dépassé. |

### Références de design à décortiquer

| Dépôt | Pourquoi celui-là |
| --- | --- |
| [adrianhajdin/award-winning-website](https://github.com/adrianhajdin/award-winning-website) | Le plus utile de la liste. Reproduction pédagogique du site Zentry, lauréat Awwwards. GSAP + React + Tailwind. **À voler :** la transition de section par `clip-path` animé, la révélation de titre par masque, le traitement vidéo du héro. Très largement suivi, donc le code est propre et commenté. |
| [darkroomengineering/satus](https://github.com/darkroomengineering/satus) | Le starter des auteurs de Lenis. À lire pour **l'architecture** : comment ils organisent les hooks de scroll, la gestion du `prefers-reduced-motion`, et la séparation entre logique d'animation et composants. C'est le dépôt le plus professionnel de cette liste. |
| [tsogjavklann/awwwards-3d](https://github.com/tsogjavklann/awwwards-3d) | Contient un fichier `ANTI_PATTERNS.md` listant une vingtaine de « ne jamais faire ça » avec les signes à repérer en revue de code. À lire même si on ne fait pas de 3D : c'est la meilleure checklist anti-clichés disponible gratuitement. |
| [Fullstack-Empire/GSAP-Awwwards-Website](https://github.com/Fullstack-Empire/GSAP-Awwwards-Website) | Une seconde lecture des mêmes techniques, utile pour comparer deux implémentations du même effet. |
| [darkroomengineering/react-lenis](https://github.com/darkroomengineering/react-lenis) | Le wrapper React. On ne l'utilise pas, mais il montre exactement **le cycle de vie** à reproduire dans un service Angular : init, pause, reprise, destruction. |

### Les pages de sujets GitHub à parcourir

Plutôt que de chercher au hasard, trois pages listent en permanence les dépôts actifs de cette esthétique :

- [github.com/topics/awwwards](https://github.com/topics/awwwards)
- [github.com/topics/gsap-scrolltrigger](https://github.com/topics/gsap-scrolltrigger)
- [github.com/topics/lenis](https://github.com/topics/lenis)

Filtrer par « Recently updated » et ignorer tout ce qui a plus d'un an : les techniques de scroll ont beaucoup bougé.

### Galeries d'inspiration, hors GitHub

Pour la direction artistique plutôt que le code. Une heure dans ces galeries vaut dix prompts.

| Galerie | URL | Spécialité |
| --- | --- | --- |
| Awwwards | [awwwards.com](https://www.awwwards.com) | La référence, filtrable par couleur et par type de site |
| Godly | [godly.website](https://godly.website) | Sélection resserrée, très orientée typographie |
| Land-book | [land-book.com](https://land-book.com) | Pages d'accueil, utile pour les structures de section |
| SiteInspire | [siteinspire.com](https://www.siteinspire.com) | Classé par style, bon pour le sombre et l'éditorial |
| Typewolf | [typewolf.com](https://www.typewolf.com) | Associations de polices réellement utilisées en production |
| Fontshare | [fontshare.com](https://www.fontshare.com) | Les polices gratuites de qualité, dont Satoshi |

### Comment s'en servir sans les copier

La frontière est simple : **on reprend des mécaniques, jamais des compositions.** Une transition par masque est une technique, elle appartient à tout le monde. Une mise en page de héro avec sa typographie, son découpage et son vocabulaire est une œuvre, elle appartient au studio qui l'a faite. Le livrable doit pouvoir être montré au studio d'origine sans gêne.

## Plan d'exécution et prompts

Sept lots, dans cet ordre. L'ordre compte : les fondations avant les effets, et la page d'accueil avant les pages secondaires. Les durées supposent un développeur seul qui connaît Angular.

| Lot | Contenu | Durée | Livrable vérifiable |
| --- | --- | --- | --- |
| 1 | Tokens, polices, base CSS, couches grain et halo, en-tête et pied de page | 1,5 j | Une page vide mais déjà « de marque » |
| 2 | SSR + prerender, service des dates, SEO de base | 1 j | `view-source:` montre le contenu, Lighthouse > 90 |
| 3 | Composants du design system (les 14) en page de démonstration isolée | 2 j | Une route `/kit` qui montre tous les composants et leurs états |
| 4 | Page d'accueil, sections 00 à 11 | 3 j | Accueil complet, responsive, sans animation de scroll |
| 5 | Lenis, GSAP, directive de révélation, halo au scroll, section pinnée | 2 j | Le site « bouge » ; `prefers-reduced-motion` vérifié |
| 6 | `/deposer` en quatre étapes + confirmation, `/partenaires` + bulletin | 2,5 j | Un dossier test déposé de bout en bout |
| 7 | `/le-concours`, `/projets`, `/projets/:slug`, `/contact`, `/affiche`, 404 | 2 j | Toutes les routes prerendues |

Total : environ 14 jours-homme. Le lot 3 est celui qu'on est tenté de sauter ; ne pas le sauter, c'est lui qui évite de réécrire trois fois le même bouton.

### Instruction permanente pour l'agent

À coller en tête de chaque session de développement, avant toute demande.

```markdown
Tu travailles sur la refonte du site SJI INNOVA 2027 (Angular, standalone, signals).
Le document d'implémentation fait foi : charte, tokens, composants, contenus.
Toute la charte est prélevée sur le logo : bleu nuit → bleu vif, or, vert et rouge
de l'arc, et blanc. Aucune couleur hors de cette palette.

Règles non négociables :
- THÈME CLAIR. Fond --paper (blanc). Aucun thème sombre, ni global ni en option.
  Le bleu nuit ne remplit que deux blocs : l'appel final et le pied de page.
- L'or est un accent de SURFACE : jamais plus de 10 % de l'écran, et jamais en petit
  texte (pour du texte doré, c'est --gold-700, pas --gold-500).
- Pas de dégradé violet. Pas de gris neutre : tous les gris sont bleutés.
- Pas de police Inter. Pas d'emoji dans l'interface.
- Pas trois cartes identiques en ligne avec une icône ronde en haut.
- Une carte se sépare du fond par un filet ou par une valeur, pas par une ombre floue.
- Jamais de bibliothèque de composants UI (Material, PrimeNG, Bootstrap).
- Toutes les valeurs viennent des tokens CSS. Aucune couleur ni taille en dur.
- Toute animation : transform et opacity uniquement, et respecte prefers-reduced-motion.
- Le texte est présent et lisible dans le DOM même si le JS échoue.
- Un composant par fichier, un fichier de moins de 200 lignes.
- Français, avec les accents et les espaces insécables avant : ; ! ?

Avant de livrer, tu vérifies : contraste AA, navigation au clavier, rendu à 390 px,
et qu'aucun des sept marqueurs de « design généré » du document n'est présent.
```

### Prompt du lot 1

```markdown
Mets en place les fondations visuelles du site. Thème clair.

1. styles/_tokens.scss : toutes les variables CSS de la charte du document — palette
   prélevée sur le logo, dégradés (--glow-gold, --navy-block, --arrow), échelle
   typographique en clamp, espacements, rayons, ombres TEINTÉES en bleu nuit,
   anneaux de focus.
2. Installe Bricolage Grotesque, Satoshi et JetBrains Mono en woff2 auto-hébergés,
   sous-réglage latin + latin-ext, font-display: swap, preload des deux critiques.
3. Deux calques fixes en pointer-events: none : grain (PNG 128 px, opacité .022,
   mix-blend-mode: multiply) et la diagonale dorée — un path SVG fixe tracé en
   --arrow, 3 px, dont le stroke-dashoffset suit la progression du scroll — avec
   une lueur --glow-gold discrète à son extrémité.
4. En-tête : transparent sur le héro, condensé au scroll (88 → 64 px, fond blanc à
   85 % avec backdrop-filter et filet bas), logo à gauche, 5 liens au centre,
   bouton or + compte à rebours à droite.
   Menu mobile : panneau plein écran BLANC, rubriques en display 32 px numérotées
   01-05 en --navy-900, bouton texte MENU / FERMER, filet tricolore en haut.
5. Pied de page : fond --navy-block, texte blanc, 4 colonnes selon le document,
   filet tricolore 4 px sur toute la largeur en bas.

Livre une page d'accueil vide entre l'en-tête et le pied de page.
```

### Prompt du lot 4, section héro

Le héro est la section où l'agent produit le plus souvent du générique. Ce prompt est volontairement très contraint.

```markdown
Construis la section héro de la page d'accueil. Fond blanc.

Contraintes de mise en page :
- Hauteur 100svh. Grille 12 colonnes. Contenu UNIQUEMENT sur les colonnes 1 à 7.
  Rien n'est centré. Alignement à gauche sur la marge du conteneur.
- Colonnes 8 à 12 : le motif d'ailes (3 à 5 lames en --blue-500 à 6-10 % d'opacité),
  un arc bleu pâle qui sort du cadre, et l'ampoule du logo en SVG.
  Parallaxe à la souris, 12 px d'amplitude maximum.
- Trame de points en fond, très légère. Aucune ombre dans cette section.

Contenu, dans cet ordre :
1. Étiquette mono : 2ᵉ ÉDITION · SAINT JEAN INGÉNIEUR · YAOUNDÉ
2. Titre display sur 3 lignes : « Imaginez. » / « Innover. » / « Construire demain. »
   Tout le titre en --navy-900. « Innover » n'est PAS en or (illisible sur blanc) :
   il reçoit un soulignement manuscrit en SVG, --gold-500, 6 px, qui se dessine
   en 700 ms.
   font-size: var(--fs-display), line-height .92, letter-spacing -.035em, weight 800.
3. Paragraphe de 2 lignes maximum, --fs-lead, couleur --text-dim.
4. Bouton or « Déposer mon projet » + bouton fantôme « Voir le règlement ».
5. Compte à rebours en mono, texte dépendant de la phase (service des dates).

En bas à gauche : filet vertical 48 px avec un point doré qui descend en boucle,
et le mot DÉFILER en mono vertical.

À 390 px : le visuel passe derrière le texte à 8 % d'opacité, titre plafonné à 44 px.
```

### Comment corriger l'agent quand le résultat est fade

Trois formulations qui fonctionnent mieux que « rends ça plus beau » :

- « Cette section est symétrique et centrée. Décale le contenu sur les colonnes 1 à 7 et laisse le reste vide. »
- « Tu as utilisé trois cartes de même taille. Donne à la première le double de surface et supprime les icônes. »
- « Le titre fait 32 px. Le document demande `--fs-display`, soit jusqu'à 140 px. Agrandis-le et resserre l'interlignage à 0,92. »

La règle derrière ces trois phrases : **ne jamais demander un adjectif, toujours une valeur ou une structure.**

## Checklist de recette

À cocher avant la mise en ligne. Le test décisif est le dernier.

**Contenu**

- [ ] Plus aucune occurrence de « 2026 » là où il faut lire « 2027 »
- [ ] Les cinq dates du calendrier correspondent au dossier de partenariat
- [ ] Les trois numéros de téléphone sont cliquables et corrects
- [ ] Les quatre comptes de réseaux pointent vers les bons profils
- [ ] Le nom exact de l'établissement est validé par le comité
- [ ] Le règlement en PDF est téléchargeable et à jour
- [ ] Aucun texte de remplissage, aucun « Lorem », aucune photo de banque d'images

**Technique**

- [ ] `view-source:` sur la page d'accueil montre le texte, pas une page vide
- [ ] Toutes les routes publiques sont prerendues et présentes dans `sitemap.xml`
- [ ] Lighthouse mobile : performance ≥ 92, accessibilité ≥ 95, SEO = 100
- [ ] Poids de la page d'accueil sous 1,5 Mo, JavaScript sous 280 Ko
- [ ] Aucune erreur dans la console, en navigation et au scroll
- [ ] Le site fonctionne avec JavaScript désactivé, en lecture seule
- [ ] Aucun appel réseau vers un domaine tiers non prévu

**Formulaires**

- [ ] Un dossier complet déposé de bout en bout, pièces jointes incluses
- [ ] L'e-mail de confirmation arrive, avec le numéro de dossier
- [ ] Le brouillon est restauré après fermeture et réouverture de l'onglet
- [ ] Un fichier trop lourd affiche un message clair, pas une erreur technique
- [ ] Le bulletin de partenariat arrive à la bonne adresse

**Accessibilité**

- [ ] Parcours complet au clavier, du lien d'évitement jusqu'à l'envoi du dossier
- [ ] Contrastes vérifiés au contrôleur, y compris `--paper-dim` et l'or
- [ ] `prefers-reduced-motion` activé : plus aucune animation, site intégralement lisible
- [ ] Un lecteur d'écran annonce correctement les étapes du formulaire
- [ ] Zoom à 200 % sans perte de contenu ni défilement horizontal

**Responsive et terrain**

- [ ] Testé sur un vrai Android d'entrée de gamme, pas seulement dans le simulateur
- [ ] Testé en 3G bridée : la page reste utilisable sous 5 secondes
- [ ] Aucun défilement horizontal à 320, 390 et 768 px
- [ ] Le tableau des niveaux de partenariat est lisible en mobile
- [ ] Le lien partagé sur WhatsApp affiche la bonne image et le bon titre

**Le test décisif**

- [ ] Montrer une capture de la page d'accueil à trois personnes qui ne connaissent pas le projet et leur demander : « ça ressemble à quoi ? ». Si l'un d'eux répond « à un site d'IA » ou « à un template », le travail n'est pas fini — reprendre la section 2 et le lot concerné.
