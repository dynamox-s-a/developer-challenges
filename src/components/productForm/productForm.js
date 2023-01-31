import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { Box, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { Title, Form, Button } from './styles';
import CreateAndEdit from '../../layouts/CreateAndEdit';
import { productSchema } from '../../schemas/productSchema';
import formatDate from '../../utils/formatDateForm';
import useConfigHeaders from '../../utils/useConfigHeaders';
import { postNewProduct, editProduct } from '../../services/apiProducts';

export default function SubmitProduct({ product, page }) {
  const config = useConfigHeaders();
  const navigate = useNavigate();

  async function postProduct(values) {
    try {
      if (page === 'newProductPage') {
        await postNewProduct(values, config);
      } else {
        await editProduct(product.id, values, config);
      }
      toast('Produto adicionado com sucesso!');
      navigate('/products');
    } catch (err) {
      toast(`Não foi possível cadastrar o produto! ${err}`);
    }
  }

  return (
    <CreateAndEdit>
      <Title>{page === 'newProductPage' ? 'Adicionar produto' : 'Editar produto'}</Title>
      <Formik
        initialValues={{
          name: product.name || '',
          fabricationDate: formatDate(product.fabricationDate) || '',
          perishable: product.perishable || '',
          expirationDate: formatDate(product.expirationDate) || '',
          price: product.price || ''
        }}
        validationSchema={productSchema}
        onSubmit={(values) => {
          postProduct(values);
        }}
        enableReinitialize>
        {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
          <>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                value={values.name}
                onChange={handleChange}
                id="name"
                onBlur={handleBlur}
                name="name"
                type="text"
                label="Nome do produto"
                placeholder={values.name || 'Nome do produto'}
                InputLabelProps={{
                  shrink: true
                }}
                className={errors.name && touched.name ? ' form__field input-error' : 'form__field'}
              />
              {errors.name && touched.name && <p className="error">{errors.name}</p>}

              <TextField
                value={values.fabricationDate}
                onChange={handleChange}
                id="fabricationDate"
                onBlur={handleBlur}
                name="fabricationDate"
                type="date"
                label="Data de fabricação"
                placeholder={'Data de fabricação'}
                InputLabelProps={{
                  shrink: true
                }}
                className={
                  errors.fabricationDate && touched.fabricationDate
                    ? ' form__field input-error'
                    : 'form__field'
                }
              />
              {errors.fabricationDate && touched.fabricationDate && (
                <p className="error">{errors.fabricationDate}</p>
              )}

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Perecível?</InputLabel>
                  <Select
                    labelId="perishable"
                    id="perishable"
                    name="perishable"
                    value={values.perishable}
                    label="perishable"
                    onChange={handleChange}
                    color="success"
                    required>
                    <MenuItem value={true}>Sim</MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                value={values.expirationDate}
                onChange={handleChange}
                id="expirationDate"
                onBlur={handleBlur}
                name="expirationDate"
                type="date"
                label="Data de validade"
                placeholder="Data de validade"
                InputLabelProps={{
                  shrink: true
                }}
                disabled={!values.perishable}
                className={
                  errors.expirationDate && touched.expirationDate
                    ? ' form__field input-error'
                    : 'form__field'
                }
              />
              {errors.expirationDate && touched.expirationDate && (
                <p className="error">{errors.expirationDate}</p>
              )}

              <TextField
                value={values.price}
                onChange={handleChange}
                id="price"
                onBlur={handleBlur}
                name="price"
                type="number"
                label="Preço do produto"
                placeholder={values.price || 'R$'}
                InputLabelProps={{
                  shrink: true
                }}
                className={
                  errors.price && touched.price ? ' form__field input-error' : 'form__field'
                }
              />
              {errors.price && touched.price && <p className="error">{errors.price}</p>}
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
