import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/products/productsActions";
import { Header } from "../components/header";
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
import {
  isPerishableSchema,
  notPerishableSchema,
} from "../services/helpers";

const creationSchema = z.discriminatedUnion("perishable", [
  notPerishableSchema,
  isPerishableSchema,
]);

export default function AddProduct() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(creationSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateProduct = (data) => {
    dispatch(
      createProduct({
        ...data,
        expirationDate: data.expirationDate ? data.expirationDate : "-",
      })
    );
    navigate("/");
  };

  const isProductPerishable = watch("perishable");
  const manufactureDateValue = watch("manufactureDate");

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box>
          <Typography variant="h4" gutterBottom mt={2}>
            Criar produto
          </Typography>
          <form onSubmit={handleSubmit((data) => handleCreateProduct(data))}>
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
                  control={<Checkbox {...register("perishable")} />}
                  label="Produto Perecível"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.manufactureDate}>
                  <InputLabel
                    htmlFor="manufactureDate"
                  >
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
