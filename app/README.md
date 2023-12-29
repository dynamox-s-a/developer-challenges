# Comentário sobre o desafio

## Processo de densevolvimento

A forma com que o teste é estruturado facilita a construcao e a organização das etapas a serem desenvolvidas. Pude revisar a utilização do Redux e conhecer mais sobre Redux Saga e Highchart.

## Desafios encontrados

- Redux/Redux Saga: fazia algum tempo que eu não trabalhava com o Redux, acredito que consegui fazer o app funcionar, mas senti dificuldade pela falta de prática com a ferramenta.

- HighCharts: é uma biblioteca que eu nunca utilizei, gostei de trabalhar com ela no teste, é bem documentada. Ficou faltando sincronizar os gráficos, devido a época do ano, iniciei mas não conclui a tempo e optei por não commitar as alterações.

---

## Run the project

To run the App use the command.

```bash
npm run dev
```

To run the fake API use the command.

```bash
npm run dev:mock
```

To run the test use the command.

```bash
npm run test
```

---

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
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
