import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// The vitest jsdom environment exposes sessionStorage but omits localStorage, so the session
// store backs it with an in-memory Storage.
if (typeof globalThis.localStorage === "undefined") {
  const backing = new Map<string, string>();
  const storage: Storage = {
    getItem: (key) => backing.get(key) ?? null,
    setItem: (key, value) => {
      backing.set(key, String(value));
    },
    removeItem: (key) => {
      backing.delete(key);
    },
    clear: () => backing.clear(),
    key: (index) => [...backing.keys()][index] ?? null,
    get length() {
      return backing.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: storage, writable: true });
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ResizeObserverStub implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

globalThis.ResizeObserver = ResizeObserverStub;
