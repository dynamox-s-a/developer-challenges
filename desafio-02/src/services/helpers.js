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

export const sortById = (a, b, isAsc) => (isAsc ? a.id - b.id : b.id - a.id);

export const sortByName = (a, b, isAsc) =>
  (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1) * (isAsc ? 1 : -1);

export const sortByManufactureDate = (a, b, isAsc) =>
  (new Date(a.manufactureDate) > new Date(b.manufactureDate) ? 1 : -1) *
  (isAsc ? 1 : -1);

export const sortByPerishable = (a, b, isAsc) =>
  (a.perishable > b.perishable ? 1 : -1) * (isAsc ? 1 : -1);

export const sortByExpirationDate = (a, b, isAsc) => {
  //ordenação ascendente funciona
  if (
    !a.hasOwnProperty("expirationDate") ||
    !b.hasOwnProperty("expirationDate")
  ) {
    return a.hasOwnProperty("expirationDate") ? 1 : -1 * (isAsc ? 1 : -1);
  } else {
    const d1 = new Date(a.expirationDate);
    const d2 = new Date(b.expirationDate);
    return (d1 > d2 ? 1 : -1) * (isAsc ? 1 : -1);
  }
};

export const sortByPrice = (a, b, isAsc) =>
  (a.price > b.price ? 1 : -1) * (isAsc ? 1 : -1);
