// Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import { describe, it, expect } from 'vitest';

describe("Header Component", () => {
  it("should render the header with correct text", () => {
    render(<Header />);
    expect(screen.getByText("Análise de Dados")).toBeInTheDocument();
  });
});
