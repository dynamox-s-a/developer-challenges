import Navbar from "@/components/Navbar";
import Product from "@/components/Product/Product";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace("/login");
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts();
  }, [page])

  const getProducts = () => {
    fetch(`http://localhost:8080/products?_page=${page}&_limit=10&_sort=name&_order=asc`)
      .then(res => {
        return res.json();
      })
      .then(data => setProducts(data));
  }

  return (
    <div>
      <Navbar />
      <Container sx={{ my: 5 }}>
        <Box display="flex" sx={{ margin: '15px 0px' }}>
          <Typography variant="h4" mx={1} >Lista de produtos</Typography>
        </Box>

        <Grid container gap={4} >
          {products.map(product => (
            <Grid key={product.id} item xs={12} lg={3}>
              <Product product={product} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px', justifyContent: 'center' }}>
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)} variant="text">Anterior</Button>
          )}
          <Typography mx={1} >Página:{page} de 10</Typography>
          {page < 10 && (
            <Button onClick={() => setPage(page + 1)} variant="text">Próxima</Button>
          )}
        </Box>
      </Container>
    </div>
  )
}