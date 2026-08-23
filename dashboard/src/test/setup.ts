import "@testing-library/jest-dom/vitest";

if (!globalThis.CSS?.supports) {
  Object.defineProperty(globalThis, "CSS", {
    value: { supports: () => false },
    configurable: true,
  });
}
