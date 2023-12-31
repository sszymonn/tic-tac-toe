# Setup overview

The game comprises of two parts:
- a web client developed with React
- a serverless backend utilizing Firebase (realtime database, functions, auth)

This is not a monorepo hence you have to install dependencies in root directory as well as in `/functions` directory

```
npm i
cd ./functions && npm i
```

To run locally and during tests you need to install firebase-tools globally `npm i -g firebase-tools`

Then to develop client, in root directory:
`npm run dev`

Then in new terminal window, to develop backend locally `cd functions` and:
`npm run build:watch`

Then in new terminal window (in root directory):
`npm run firebase:local`


You can explore data and function logs locally on:
http://127.0.0.1:8080/database/tic-tac-toe-70579/data

# Testing

Unit tests can be run with vitest (in root directory):
- `npm run test`

E2E test can be run with playwright (in root directory):
- make sure app and emulators run in separate terminals (`npm run dev` and `npm run firebase:local`)
- run `npm run test:e2e` or via VS Code plugin

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
