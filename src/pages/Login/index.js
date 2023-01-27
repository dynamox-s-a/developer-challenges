import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Auth from "../../layouts/Auth";
import { Title } from "./styles";
import { Form } from "./styles";
import { Formik } from "formik";
import { loginSchema } from "../../schemas/loginSchema";
import { Button } from "./styles";
import { PostLogin } from "../../services/authApi";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Login() {
  const [setValue] = useLocalStorage("desafio02/barbara-rech", "");
  const navigate = useNavigate();

  async function submitLogin(values) {
    try {
      const user = await PostLogin(values.email, values.password);
      setValue(user);

      toast("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      toast(`Não foi possível fazer o login! ${err}`);
    }
  }

  return (
    <Auth>
      <Title>Login</Title>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          submitLogin(values);
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
    </Auth>
  );
}
