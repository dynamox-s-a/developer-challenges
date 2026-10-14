import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        files: ["**/*.ts"],
        rules: {
            // Cypress's chainable API is designed around side effects.
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },
];
