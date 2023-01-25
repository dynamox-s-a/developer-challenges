import { Form } from "./styles";
import React from "react";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Button from "@/components/Button/Button";

export default function SignInForm() {
  const onSubmit = (values, { resetForm }) => {
    alert(JSON.stringify(values));
    resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        company: "",
        email: "",
        phone: "",
      },
      // validationSchema: contactSchema,
      onSubmit,
    });

  return (
    <>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <input
          value={values.name}
          onChange={handleChange}
          id="name"
          onBlur={handleBlur}
          name="name"
          type="name"
          placeholder="Como você gostaria de ser chamado?"
          className={
            errors.name && touched.name
              ? " form__field input-error"
              : "form__field"
          }
        />
        {errors.name && touched.name && <p className="error">{errors.name}</p>}

        <input
          value={values.company}
          onChange={handleChange}
          id="company"
          onBlur={handleBlur}
          name="company"
          type="company"
          placeholder="Em qual empresa você trabalha?"
          className={
            errors.company && touched.company
              ? " form__field input-error"
              : "form__field"
          }
        />
        {errors.company && touched.company && (
          <p className="error">{errors.company}</p>
        )}

        <input
          value={values.email}
          onChange={handleChange}
          id="email"
          onBlur={handleBlur}
          name="email"
          type="email"
          placeholder="Digite aqui o seu email"
          className={
            errors.email && touched.email
              ? " form__field input-error"
              : "form__field"
          }
        />
        {errors.email && touched.email && (
          <p className="error">{errors.email}</p>
        )}

        <input
          value={values.phone}
          onChange={handleChange}
          id="phone"
          onBlur={handleBlur}
          name="phone"
          type="phone"
          placeholder="Qual o seu telefone?"
          className={
            errors.phone && touched.phone
              ? " form__field input-error"
              : "form__field"
          }
        />
        {errors.phone && touched.phone && (
          <p className="error">{errors.phone}</p>
        )}
      </Form>
      <Button type="submit" onClick={handleSubmit} color="primary">
        Enviar
      </Button>
    </>
  );
}
