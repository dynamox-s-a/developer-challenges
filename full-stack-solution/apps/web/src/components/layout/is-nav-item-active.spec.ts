import { describe, expect, it } from "vitest";
import { isNavItemActive } from "./is-nav-item-active";

describe("isNavItemActive", () => {
  it("matches the overview only on the exact root path", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/", "/machines")).toBe(false);
  });

  it("matches a section and its nested paths", () => {
    expect(isNavItemActive("/machines", "/machines")).toBe(true);
    expect(isNavItemActive("/machines", "/machines/123")).toBe(true);
  });

  it("does not match a different section with the same prefix", () => {
    expect(isNavItemActive("/machines", "/machines-archive")).toBe(false);
  });
});
