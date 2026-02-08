import { describe, it, expect } from "vitest";
import { validateEventForm } from "./validation";

describe("validateEventForm", () => {
  const validData = {
    name: "Evento Teste",
    date: "2026-12-25T10:00:00",
    location: "São Paulo",
    description:
      "Descrição válida com mais de cinquenta caracteres para passar na validação.",
    category: "Conferência" as const,
  };

  it("deve retornar objeto vazio para dados válidos", () => {
    const errors = validateEventForm(validData);
    expect(errors).toEqual({});
  });

  it("deve validar nome obrigatório", () => {
    const errors = validateEventForm({ ...validData, name: "" });
    expect(errors.name).toBe("Nome é obrigatório");
  });

  it("deve validar data futura", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const errors = validateEventForm({
      ...validData,
      date: pastDate.toISOString(),
    });
    expect(errors.date).toBe("A data deve ser futura");
  });

  it("deve validar descrição mínima de 50 caracteres", () => {
    const errors = validateEventForm({
      ...validData,
      description: "Curta",
    });
    expect(errors.description).toContain("50 caracteres");
  });
});
