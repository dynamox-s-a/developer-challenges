import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Auth from "../../layouts/Auth";
import { Title, Form, Button } from "./styles";
import { loginSchema } from "../../schemas/loginSchema";
import { postUser } from "../../features/users/usersSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function submitLogin(values) {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIyQHVzZXIuY29tIiwiaWF0IjoxNjc0ODI2MjM3LCJleHAiOjE2NzQ4Mjk4MzcsInN1YiI6IjcifQ.tpZdn8QqezHnm5EWcxWYfa0w_CjtgUHGaDm8bBd5W3w";

      dispatch(
        postUser({
          email: values.email,
          token: token,
        })
      );

      toast("Login realizado com sucesso!");
      navigate("/products");
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
