import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./utils";
import { screen } from "@testing-library/react";
import App from "../App";

describe("App routing", () => {
  it.each(["/", "/data", "/unknown"])(
    "route %s shows the page title",
    (route) => {
      renderWithProviders(<App />, { route });
      expect(
        screen.getByRole("heading", { name: "Análise de Dados" }),
      ).toBeInTheDocument();
    },
  );
});
