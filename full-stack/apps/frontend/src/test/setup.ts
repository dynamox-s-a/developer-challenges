import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

beforeEach(() => {
  localStorage.clear();
});

const localStorageMock = {
  getItem: vi.fn((key: string) => {
    return (vi.mocked(localStorageMock)._store as any)[key] || null;
  }),
  setItem: vi.fn((key: string, value: string) => {
    (vi.mocked(localStorageMock)._store as any)[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete (vi.mocked(localStorageMock)._store as any)[key];
  }),
  clear: vi.fn(() => {
    (vi.mocked(localStorageMock)._store as any) = {};
  }),
  _store: {},
};
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

// Mock do api instance
vi.mock("../api/api", async () => {
  const mod = await import("../__tests__/mocks/api");
  return { default: mod.default };
});
