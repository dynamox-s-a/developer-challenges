import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateAndEdit from "../../layouts/CreateAndEdit";
import { Title } from "./styles";
import { Form } from "./styles";
import { Formik, Field, FormikProps } from "formik";
import { loginSchema } from "../../schemas/loginSchema";
import { Button } from "./styles";
import useConfigHeaders from "../../utils/useConfigHeaders";
import { postNewProduct } from "../../services/apiProducts";

export default function NewProduct() {
  const config = useConfigHeaders();
  const navigate = useNavigate();

  async function submitNewProduct(values) {
    try {
      await postNewProduct(values, config);
      toast("Produto adicionado com sucesso!");
      navigate("/products");
    } catch (err) {
      toast(`Não foi possível cadastrar o produto! ${err}`);
    }
  }

  return (
    <CreateAndEdit>
      <Title>Adicionar produto</Title>
      <Formik
        initialValues={{
          name: "",
          fabricationDate: "",
          perishable: "",
          expirationDate: "",
          price: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          submitNewProduct(values);
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
                value={values.name}
                onChange={handleChange}
                id="name"
                onBlur={handleBlur}
                name="name"
                type="text"
                placeholder="Nome do produto"
                className={
                  errors.name && touched.name
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.name && touched.name && (
                <p className="error">{errors.name}</p>
              )}

              <input
                value={values.fabricationDate}
                onChange={handleChange}
                id="fabricationDate"
                onBlur={handleBlur}
                name="fabricationDate"
                type="date"
                placeholder="Digite aqui a data de fabricação"
                className={
                  errors.fabricationDate && touched.fabricationDate
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.fabricationDate && touched.fabricationDate && (
                <p className="error">{errors.fabricationDate}</p>
              )}

              <input
                value={values.perishable}
                onChange={handleChange}
                id="perishable"
                onBlur={handleBlur}
                name="perishable"
                type="text"
                placeholder="O produto é perecível?"
                className={
                  errors.perishable && touched.perishable
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.perishable && touched.perishable && (
                <p className="error">{errors.perishable}</p>
              )}

              <Field as="select" name="O produto é perecível?">
                <option value='true'>Sim</option>
                <option value="false">Não</option>
              </Field>

              <input
                value={values.expirationDate}
                onChange={handleChange}
                id="expirationDate"
                onBlur={handleBlur}
                name="expirationDate"
                type="text"
                placeholder="Digite aqui a data de validade"
                onFocus="(this.type='date')"
                className={
                  errors.expirationDate && touched.expirationDate
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.expirationDate && touched.expirationDate && (
                <p className="error">{errors.expirationDate}</p>
              )}

              <input
                value={values.price}
                onChange={handleChange}
                id="price"
                onBlur={handleBlur}
                name="price"
                type="number"
                placeholder="Preço"
                className={
                  errors.price && touched.price
                    ? " form__field input-error"
                    : "form__field"
                }
              />
              {errors.price && touched.price && (
                <p className="error">{errors.price}</p>
              )}
            </Form>
            <Button type="submit" onClick={handleSubmit} color="primary">
              Enviar
            </Button>
          </>
        )}
      </Formik>
    </CreateAndEdit>
  );
}
