import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  fabricationDate: yup.date().required('Insira a data de fabricação!'),
  perishable: yup.boolean().required('Diga se o produto é perecível'),
  expirationDate: yup.date().when('perishable', {
    is: true,
    then: yup
      .date()
      .min(
        yup.ref('fabricationDate'),
        'A data de validade deve ser maior que a data de fabricação!'
      )
      .required('Insira a data de validade!')
  }),
  price: yup.number().required('Insira o preço do produto!')
});
