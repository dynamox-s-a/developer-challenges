module.exports = {
  roots: ["<rootDir>"],
  collectCoverageFrom: ["<rootDir>/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/cypress",
    "<rootDir>/.next",
  ],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "\\.scss$": "identity-obj-proxy",
    "^pages/(.*)$": "<rootDir>/pages/$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  automock: false,
  resetMocks: false,
  setupFiles: ["<rootDir>/jest-fetch-mock.setup.js"],
};
