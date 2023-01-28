import { Container, Title, Description } from "./styles";
import formatPrice from "../../utils/formatPrice";

export default function RenderProducts(products) {
  if (products.length === 0) {
    return <p>Não há nenhum produto cadastrado ainda!</p>;
  }

  return products.map((product, index) => {
    return (
      <Container key={index}>
        <Title> {product.name}</Title>
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
