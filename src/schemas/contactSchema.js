import * as yup from "yup";

export const contactSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório!"),
  company: yup.string().required("O campo empresa é obrigatório!"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("O campo email é obrigatório!"),
  phone: yup.string().required("O campo telefone é obrigatório!"),
});
