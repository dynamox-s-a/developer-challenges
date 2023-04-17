import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

export default function Product({ product }) {
  const router = useRouter();
  const manufacturingDate = new Intl.DateTimeFormat('pt-BR').format(new Date(product.manufacturing_date + "T00:00:00"));
  const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
  let expirationDate;
  if (product.is_perishable) {
    expirationDate = new Intl.DateTimeFormat('pt-BR').format(new Date(product.expiration_date + "T00:00:00"));
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 1.5, textTransform: 'capitalize' }}>
          {product.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Fabricado em: {manufacturingDate}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Produto Perecível? {product.is_perishable ? "✔️" : "❌"}
        </Typography>
        {product.is_perishable &&
          (<Typography sx={{ mb: 1.5 }} color="text.secondary">
            Válido até: {expirationDate}
          </Typography>)
        }
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {price}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: 'auto' }}>
        <Button
          variant="text"
          size="small"
          onClick={() => router.push(`/editar/${product.id}`)}
        >
          Editar Produto
        </Button>
      </CardActions>
    </Card>
  );
}