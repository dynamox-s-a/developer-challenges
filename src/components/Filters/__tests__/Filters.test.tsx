// Filters.test.tsx
import { render, screen } from "@testing-library/react";
import Filters from "../Filters";
import { dataItems } from "../dataItems";
import { describe, it, expect } from 'vitest';

describe("Filters Component", () => {
  it("should render all filter items", () => {
    render(<Filters />);
    dataItems.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
      expect(screen.getByAltText(item.text)).toBeInTheDocument();
    });
  });
});
