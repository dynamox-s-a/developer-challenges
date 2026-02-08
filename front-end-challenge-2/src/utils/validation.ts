import { VALIDATION_RULES } from "@/constants/events";
import { CreateEventDto } from "@/types";

export const validateEventForm = (formData: CreateEventDto) => {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) errors.name = "Nome é obrigatório";

  if (!formData.date) {
    errors.date = "Data e hora são obrigatórias";
  } else if (new Date(formData.date) <= new Date()) {
    errors.date = "A data deve ser futura";
  }

  if (!formData.location.trim()) errors.location = "Local é obrigatório";

  if (!formData.description.trim()) {
    errors.description = "Descrição é obrigatória";
  } else if (
    formData.description.trim().length < VALIDATION_RULES.MIN_DESCRIPTION_LENGTH
  ) {
    errors.description = `Descrição deve ter no mínimo ${VALIDATION_RULES.MIN_DESCRIPTION_LENGTH} caracteres`;
  }

  if (!formData.category) errors.category = "Categoria é obrigatória";

  return errors;
};
