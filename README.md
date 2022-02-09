# Portail Usager

## À propos

Cartographie qui permet de localiser les permanences des conseillers numériques France Service sur le territoire.

L'application est disponible ici : https://cartographie.conseiller-numerique.gouv.fr/

## Table des matières

- [À propos](#à-propos)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Contribution](#contribution)
- [Construit avec](#construit-avec)
- [Licence](#licence)
- [Credits](#credits)

## Prérequis

- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Installation

- Exécuter `yarn install` pour installer les dépendances.

## Utilisation

### Lancement

#### Environnement par défaut (pour un démarrage rapide)

Exécuter `yarn start`, puis naviguer vers `http://localhost:4200/`.

#### Environnement local (recommandé)

Cette méthode est recommandée pour permettre aux développeurs d'utiliser une configuration locale au lieu de la configuration par défaut.

- Créer le fichier `environment.local.ts` dans le dossier `/src/env/environments`
- Copier le contenu du fichier `environment.ts` vers `environment.local.ts`
- Modifier le fichier `environment.local.ts` pour obtenir la configuration souhaitée
- Exécuter `yarn start:local`, puis naviguer vers `http://localhost:4200/`

### Construction

Exécuter `yarn build` pour construire le projet. Les fichiers de sortie sont écrits dans le dossier `dist/`.

### Test

Exécuter `yarn test` pour tester le projet.

### Lint

#### Code lint

Exécuter `yarn lint` pour une analyse statique des fichiers `.ts` du projet.

#### Style lint

Exécuter `yarn stylelint` pour une analyse statique des fichiers `.scss` du projet.

### Prettier

Exécuter `yarn prettier` pour mettre à niveau la syntaxe de l'ensemble des fichiers du projet.

### Pre-commit hooks

Les opérations prises en compte par les pre-commits hooks sont :

- prettier
- lint-staged: analyse des fichiers ajoutés pour le prochain commit.

## Contribution

### Nommage des branches

- Une branche qui apporte une nouvelle fonctionnalité doit ête préfixé par `feature/` : `feature/ma-fonctionnalite`
- Une branche qui apporte une correction doit ête préfixé par `fix/` : `fix/ma-correction`

### Déployer un environment de recette pour une branche

Chaque branche avec le préfixe `feature/` ou `fix/` est automatiquement déployée à la première publication et mise à jour lors des publications suivantes.

Une notification dans le canal mattermost `conseiller-numerique-alertes` permet de récupérer le lien correspondant à l'environnement ainsi déployé, il est aussi possible de récupérer ce lien dans les logs de l'action correspondante sur GitHub.

Ces environnements dédiés pour chaque branche permettent de faire l'étape de recette en indépendance des autres développements.

### Déployer sur l'environnement de recette en commun

Chaque publication de code est soumise à une revue fonctionnelle dans un environnement de recette et deux revues techniques sous forme de "pull request" vers la branche `main`.

Une fois que la revue fonctionnelle et que les revues techniques sont valides, la branche peut être fusionnée dans la branche `main` terminant ainsi la "pull request".

La fusion sur la branche `main` entraîne automatiquement un déploiement sur l'environnement de recette en commun disponible ici : https://app-d9a716c2-299f-4f16-ad90-30965ae57d13.cleverapps.io/

### Déployer sur l'environnement de production

Pour mettre en production il faut lancer ce workflow sur la branche `main` : https://github.com/anct-cnum/portail-usager/actions/workflows/production-continuous-deployment.yml

## Construit avec

### langages & Frameworks

- [TypeScript](https://www.typescriptlang.org/) est un langage open-source construit à partir de JavaScript
- [Angular](https://angular.io/) est une boîte à outils open-source pour construire des clients web
- [Leaflet](https://leafletjs.com/) est une bibliothèque JavaScript open-source pour créer des cartes interactives
- [Dsfr](https://www.systeme-de-design.gouv.fr/) est le système de design de l'État

### Apis

- [API adresse - data.gouv](https://adresse.data.gouv.fr/) référence l’intégralité des adresses du territoire et les rend utilisables par tous

### Outils

#### Cli

- [Webpack Bundle Analyser](https://webpack.js.org/) est un outil d'analyse pour les fichiers générés à partir de webpack, un "module bundler" qui génère des fichiers statiques à partir d'un ensemble de fichiers sources en JavaScript
- [Jest](https://jestjs.io/) est une boîte à outils pour écrire des tests automatisés en JavaScript
- [Eslint](https://eslint.org/) est un analyseur statique de JavaScript avec les plugins suivants :
  - [typescript](https://github.com/typescript-eslint/typescript-eslint)
  - [angular](https://github.com/angular-eslint/angular-eslint)
  - [prettier](https://github.com/prettier/eslint-config-prettier)
  - [jest](https://github.com/jest-community/eslint-plugin-jest)
  - [rxjs](https://github.com/cartant/eslint-plugin-rxjs)
  - [rxjs-angular](https://github.com/cartant/eslint-plugin-rxjs-angular)
- [Prettier](https://prettier.io/) est un magnificateur de code source en JavaScript
- [Stylelint](https://stylelint.io/) est un analyseur statique de scss
- [Husky](https://typicode.github.io/husky/#/) est un utilitaire pour exécuter des tâches automatisées lors des commits
- [Lint-staged](https://github.com/okonet/lint-staged) est un utilitaire pour lancer une analyse statique sur les fichiers ajoutés pour le prochain commit

#### CI

- [Github Actions](https://docs.github.com/en/actions)

#### Deploy

- [Clevercloud](https://www.clever-cloud.com/)

## Licence

Voir le fichier [LICENSE](./LICENSE.md) | [ETALAB-Licence-Ouverte-v2.0](./ETALAB-Licence-Ouverte-v2.0.pdf) du dépôt.

## Credits

- [Plateforme des acteurs de la médiation numérique](https://forge.grandlyon.com/web-et-numerique/pamn_plateforme-des-acteurs-de-la-mediation-numerique) pour être l'inspiration originale du projet.
- [Carte France Services](https://anct-carto.github.io/france_services/) est un excellent exemple de cartographie de localisation d'éléments en France métropolitaine et outre-mer.
