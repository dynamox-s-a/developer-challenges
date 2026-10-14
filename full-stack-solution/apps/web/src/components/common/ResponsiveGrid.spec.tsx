import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@web/test/test-utils";
import { ResponsiveGrid } from "./ResponsiveGrid";

function renderGrid(ui: Parameters<typeof renderWithProviders>[0]) {
  renderWithProviders(ui);
  return getComputedStyle(screen.getByText("one").parentElement!);
}

describe("ResponsiveGrid", () => {
  it("lays the cells out with gap and no compensating negative margin", () => {
    const styles = renderGrid(
      <ResponsiveGrid>
        <div>one</div>
        <div>two</div>
      </ResponsiveGrid>,
    );

    expect(styles.display).toBe("grid");
    expect(styles.gap).not.toBe("");

    // The alignment problem this component exists to avoid: MUI's Grid offsets
    // the container to the left and pads every item back, so neither a
    // negative inline offset nor a compensating cell padding may appear here.
    expect(styles.marginLeft).toMatch(/^(0(px)?)?$/);
    expect(styles.paddingLeft).toMatch(/^(0(px)?)?$/);
    // ...and the container must not be widened past its parent either.
    expect(styles.width).not.toMatch(/calc/);
  });

  it("declares the requested column count for every breakpoint", () => {
    renderWithProviders(
      <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3 }}>
        <div>one</div>
      </ResponsiveGrid>,
    );

    // jsdom resolves neither media queries nor `grid-template-columns` through
    // `getComputedStyle`, so the generated stylesheet is inspected instead.
    const css = Array.from(document.querySelectorAll("style"))
      .map((style) => style.textContent ?? "")
      .join("");

    // One column stacked on phones, two on tablets, three on desktop — the
    // six metric cards of the time-series page must read as 3 + 3, which is
    // why the count is explicit rather than derived from the width.
    expect(css).toContain("repeat(1, minmax(0, 1fr))");
    expect(css).toContain("repeat(2, minmax(0, 1fr))");
    expect(css).toContain("repeat(3, minmax(0, 1fr))");
    expect(css).not.toContain("auto-fit");
  });

  it("renders every child", () => {
    renderWithProviders(
      <ResponsiveGrid>
        <div>one</div>
        <div>two</div>
        <div>three</div>
      </ResponsiveGrid>,
    );

    expect(screen.getAllByText(/one|two|three/)).toHaveLength(3);
  });
});
