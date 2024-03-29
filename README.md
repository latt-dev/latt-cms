# Latt CMS

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Content Management System for Latt App driving creating/updating predefined paths, courses, lessons and quizzes

## Important prerequisite note

Many packages are obsolete now (2023) and require older (14) Node version to be installed, `.nvmrc` states that explicitly (if you use NVM).

## Quick Start

1. `npm install`
1. `npm start`<sup>1</sup>

_<sup>1</sup> You will need to add `.env` file with necessary [environment variables](#obfuscated-environment-variables) to the root folder when working with the app locally_

## Project Structure

- `e2e` - End-To-End tests folder
- `scripts` - environment scripts
- `src` - application source code
  - `_redirects` - file with configs required for correct routing at Netlify server
- `dist` - git-ignored production build folder
- `.env` - mandatory git-ignored file with environment variables (request repository owner)
- `.prettierrc` - code formatting configuration

## Custom Schematics

- Component schematics are set to generate a [single-file component](https://egghead.io/lessons/angular-use-single-file-components-by-default-in-angular) (with inline styles and template) with `ChangeDetectionStrategy.OnPush` by default. `flat` modifier is set to `true` to enforce using [SCAM pattern](https://indepth.dev/emulating-tree-shakable-components-using-single-component-angular-modules/) (single component Angular modules)

## Specific Tools

- [@ngneat/reactive-forms](https://github.com/ngneat/reactive-forms) package is used instead of @angular/forms

## Obfuscated Environment Variables

You need to create a `.env` file with the main environment variables required to run this project before starting to work with it:

```
LATT_DEV_API_URL=LocalBackEndAPIServerUrl
LATT_PROD_API_URL=ProductionBackEndAPIServerUrl
```

See `.env.example` file for local dev parameters example.

## Contributing

Thank you for your interest in contributing to Latt. Though there's no active open development process currently, there are some ways to contribute to this project if you really fancy to. Get started [here](https://github.com/latt-dev/latt-cms/blob/master/.github/CONTRIBUTING.md).
