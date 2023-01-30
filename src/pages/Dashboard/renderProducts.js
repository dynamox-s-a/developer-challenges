import { Container, Title, Description } from "./styles";
import formatPrice from "../../utils/formatPrice";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Link from "@mui/material/Link";

export default function RenderProducts(products) {
  if (products.length === 0) {
    return <p>Não há nenhum produto cadastrado ainda!</p>;
  }

  return products.map((product, index) => {
    return (
      <Container key={index}>
        <Title>
          {product.name}
          <Link href={`/products/${product.id}/edit`} underline="none">
            <BorderColorIcon className="editIcon" />
          </Link>
        </Title>
        <Description>Data de fabricação: {product.fabricationDate}</Description>
        <Description>
          {product.perishable
            ? `Data de validade: ${product.expirationDate}`
            : null}
        </Description>
        <Description> Preço: R$ {formatPrice(product.price)}</Description>
      </Container>
    );
  });
}
