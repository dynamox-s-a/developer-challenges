import "@testing-library/jest-dom";

type CSSSupportsOnly = {
  supports?: (property: string, value?: string) => boolean;
};

type CSSNamespaceLike = CSSSupportsOnly & Record<string, unknown>;

(function ensureCSSSupports() {
  const w = window as unknown as { CSS?: CSSNamespaceLike };

  if (!w.CSS) {
    w.CSS = {};
  }
  if (typeof w.CSS.supports !== "function") {
    w.CSS.supports = () => true;
  }
})();
