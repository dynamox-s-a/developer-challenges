import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Header } from "../components/header";
import { editProduct } from "../redux/products/productsActions";
import {
  formatDate,
  isPerishableSchema,
  notPerishableSchema,
} from "../services/helpers";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import moment from "moment";

const creationSchema = z.discriminatedUnion("perishable", [
  notPerishableSchema,
  isPerishableSchema,
]);

export default function EditProduct() {
  const { id } = useParams();
  const product = useSelector((state) =>
    state.productsSlice.products.find((product) => product.id === Number(id))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(creationSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        perishable: product.perishable,
        manufactureDate: product.manufactureDate,
        expirationDate: product.expirationDate,
      });
    }
  }, [product, reset]);

  const handleEditProduct = (data) => {
    console.log(data);
    const startDate = moment(data.startDate);
    const endDate = moment(data.endDate);
    console.log(startDate);
    console.log(endDate);

    if (endDate.isBefore(startDate)) {
      alert("End date cannot be before start date!");
    } else {
      dispatch(
        editProduct({
          id: product.id,
          ...data,
          expirationDate: data.expirationDate ? data.expirationDate : "-",
        })
      );
      navigate("/");
    }
  };

  const isProductPerishable = watch("perishable");
  const manufactureDateValue = watch("manufactureDate");

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box>
          <Typography variant="h4" gutterBottom mt={2}>
            Editar produto
          </Typography>
          <form onSubmit={handleSubmit((data) => handleEditProduct(data))}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.name}>
                  <InputLabel htmlFor="productName">Nome</InputLabel>
                  <Input
                    type="text"
                    name="name"
                    id="productName"
                    placeholder="Ex: Doritos"
                    {...register("name")}
                  />
                  <FormHelperText>{errors.name?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.price}>
                  <InputLabel htmlFor="price">Preço (R$)</InputLabel>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="5.98"
                    {...register("price")}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <FormHelperText>{errors.price?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isProductPerishable ? true : false}
                      {...register("perishable")}
                    />
                  }
                  label="Produto Perecível"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.manufactureDate}>
                  <InputLabel htmlFor="manufactureDate">
                    Data de Fabricação
                  </InputLabel>
                  <Input
                    type="date"
                    name="manufactureDate"
                    id="manufactureDate"
                    {...register("manufactureDate")}
                  />
                  <FormHelperText>
                    {errors.manufactureDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {isProductPerishable && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.expirationDate}>
                    <InputLabel
                      sx={{ textAlign: "center" }}
                      htmlFor="expirationDate"
                    >
                      Data de Validade
                    </InputLabel>
                    <Input
                      type="date"
                      name="expirationDate"
                      id="expirationDate"
                      {...register("expirationDate", {
                        shouldUnregister: true,
                      })}
                      inputProps={{ min: String(manufactureDateValue) }}
                    />
                    <FormHelperText>
                      {errors.expirationDate?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" disabled={!isValid}>
                  Criar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
}
