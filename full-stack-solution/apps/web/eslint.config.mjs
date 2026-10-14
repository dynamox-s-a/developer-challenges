import baseConfig from "../../eslint.config.mjs";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
    ...baseConfig,
    {
        files: ["**/*.tsx", "**/*.jsx"],
        plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        settings: { react: { version: "detect" } },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...reactHooks.configs.flat.recommended.rules,
            ...jsxA11y.flatConfigs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
        },
    },
];
