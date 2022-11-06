import * as yup from "yup";
export const schemaContactForm = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  company: yup.string().required("Empresa é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
});
