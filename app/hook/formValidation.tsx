import * as Yup from "yup";

export const formValidation = Yup.object().shape({

    password: Yup.string()
    .required("A senha é obrigatória")
    .matches(
      /^(?=.*[@#$%])(?=.*[a-zA-Z].*[a-zA-Z]).{8,}$/,
      "A senha deve conter pelo menos 8 caracteres, incluindo pelo menos 2 letras e 1 caractere especial (@#$%)"
    ),


    telefone: Yup.string()
    .matches(
      /^\d{10,11}$/,
      "Telefone inválido, use somente números e forneça 10 ou 11 dígitos"
    )
    .test('is-masked', 'Telefone inválido', function (value) {
      const phone = value?.replace(/\D/g, '');
      if (phone?.length === 10) {
        return /^\d{2}\d{4}\d{4}$/.test(phone);
      } else if (phone?.length === 11) {
        return /^\d{2}\d{3}\d{3}\d{3}$/.test(phone);
      }
      return false;
    })
    .required("O telefone é obrigatório"),
});




