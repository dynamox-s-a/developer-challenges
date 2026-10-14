import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  { ignores: ["**/generated/**"] },
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message: "Import the generated client from a repository instead.",
            },
          ],
          patterns: [
            {
              group: ["**/generated/prisma/**"],
              message: "Only repositories may use the generated Prisma client.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "**/*.repository.ts",
      "**/*.repository.spec.ts",
      "**/database/**",
      "**/container.ts",
    ],
    rules: { "no-restricted-imports": "off" },
  },
];
