import * as yup from "yup";
import { EventModel } from "@/dto/EventModelDto";

export type EventFormSchema = Omit<EventModel, "id">;

export const eventSchema: yup.ObjectSchema<EventFormSchema> = yup.object({
  title: yup
    .string()
    .trim()
    .required("O nome do evento é obrigatório"),

  date: yup
    .string()
    .required("A data é obrigatória"),

  time: yup
    .string()
    .required("O horário é obrigatório"),

  location: yup
    .string()
    .trim()
    .required("A localização é obrigatória"),

  category: yup
    .mixed<"conferencia" | "workshop" | "webinar" | "networking" | "outro">()
    .oneOf(["conferencia", "workshop", "webinar", "networking", "outro"], "Categoria inválida")
    .required("A categoria é obrigatória"),

  description: yup
    .string()
    .trim()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .min(50, "A descrição deve ter no minimo 50 caracteres")
    .required("A descrição é obrigatória"),
}) as yup.ObjectSchema<EventFormSchema>;
