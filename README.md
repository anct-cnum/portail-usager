# portail-usager

## A propos

Nouvelle application front-end usager du site Conseiller Numérique (https://www.conseiller-numerique.gouv.fr/).

Vise à remplacer à terme l'existant.

## Table of Contents

- [Install](#install)
- [Prerequisites](#prerequisites)
- [Built with](#built-with)
- [Installation](#installation)
- [Usage](#usage)
- [Licence](#licence)
- [Credits](#credits)

## Prerequisites

[Yarn](https://yarnpkg.com/)

## Built with

<details>
<summary> Toggle list </summary>
<br>

### Languages & Frameworks

- [TypeScript](https://www.typescriptlang.org/) is an open-source language which builds on JavaScript
- [Angular](https://angular.io/) is an open-source language which builds on JavaScript

### Tools

#### Cli

- [Webpack Bundle Analyser](https://webpack.js.org/) is a static module bundler for modern JavaScript applications
- [Jest](https://jestjs.io/) is a JavaScript Testing Framework
- [Eslint](https://eslint.org/) with plugins :
  - [typescript](https://github.com/typescript-eslint/typescript-eslint)
  - [angular](https://github.com/angular-eslint/angular-eslint)
  - [prettier](https://github.com/prettier/eslint-config-prettier)
  - [jest](https://github.com/jest-community/eslint-plugin-jest)
  - [rxjs](https://github.com/cartant/eslint-plugin-rxjs)
  - [rxjs-angular](https://github.com/cartant/eslint-plugin-rxjs-angular)
- [Prettier](https://prettier.io/)
- [Stylelint](https://stylelint.io/) with [bootstrap config](https://github.com/twbs/stylelint-config-twbs-bootstrap)
- [Husky](https://typicode.github.io/husky/#/)
- [Lint-staged](https://github.com/okonet/lint-staged)

#### CI

- [Github Actions](https://docs.github.com/en/actions)

#### Deploy

- [Clevercloud](https://www.clever-cloud.com/)

</details>

## Installation

- Run `yarn install` to install dependencies.

## Usage

### Run the app

Run `yarn start`. Navigate to `http://localhost:4200/`.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Test

Run `yarn test` to test the project.

### Lint

#### Code lint

Run `yarn lint` to lint the solution.

#### Style lint

Run `yarn stylelint` to lint the project.

### Prettier

Run `yarn prettier` to prettyfy the solution.

### Pre-commit hooks

Activated pre-commits hooks are :

- prettier.
- lint-staged: lint the files staged for commit.

## Licence

See LICENSE in repository for details.

## Credits

- **[Plateforme des acteurs de la médiation numérique](https://forge.grandlyon.com/web-et-numerique/pamn_plateforme-des-acteurs-de-la-mediation-numerique)** for being the original inspiration.
- **[ngx-leaflet](https://github.com/Asymmetrik/ngx-leaflet)** for the in-depth interaction examples between angular and leaflet events.
- **[Carte France Services](https://anct-carto.github.io/france_services/)** for being a decisive example of mapping Overseas France.
