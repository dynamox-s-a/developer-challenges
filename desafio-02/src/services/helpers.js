import { z } from "zod";
import moment from "moment";


export const formatDate = (data) => {
  const originalFormat = "YYYY-MM-DD";
  const newFormat = "DD/MM/YYYY";
  const originalMomentObject = moment(data, originalFormat);
  return originalMomentObject.format(newFormat);
};

export const notPerishableSchema = z.object({
  name: z.string().min(3),
  price: z
    .string()
    .nonempty("O preço precisa possuir pelo menos 1 caractere com o valor")
    .transform((arg) => Number(arg)),
  perishable: z.literal(false),
  manufactureDate: z
    .string()
    .nonempty("Insira a data de fabricação do produto"),
});

export const isPerishableSchema = z.object({
  name: z.string().min(3),
  price: z
    .string()
    .nonempty("O preço precisa possuir pelo menos 1 caractere com o valor")
    .transform((arg) => Number(arg)),
  perishable: z.literal(true),
  manufactureDate: z
    .string()
    .nonempty("Insira a data de fabricação do produto"),
  expirationDate: z.string().nonempty("Insira a data de validade do produto"),
});


export const notPerishableSchemaWithId = notPerishableSchema.extend({
  id: z.string().nonempty("Insira o ID do produto")
})

export const isPerishableSchemaWithId = isPerishableSchema.extend({
  id: z.string().nonempty("Insira o ID do produto")
})