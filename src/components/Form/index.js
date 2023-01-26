import { Form } from "./styles";
import React from "react";
import { Formik } from "formik";
import { loginSchema } from "../../schemas/loginSchema";
import { Button } from "./styles";

export default function LoginForm() {
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <>
            <Form onSubmit={handleSubmit} autoComplete="off">
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
                value={values.password}
                onChange={handleChange}
                id="password"
                onBlur={handleBlur}
                name="password"
                type="password"
                placeholder="Digite aqui a sua senha"
                className={
                  errors.password && touched.password
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.password && touched.password && (
                <p className="error">{errors.password}</p>
              )}
            </Form>
            <Button type="submit" onClick={handleSubmit} color="primary">
              Enviar
            </Button>
          </>
        )}
      </Formik>
    </>
  );
}
