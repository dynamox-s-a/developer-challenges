import { Container, Title, Description } from "./styles";

export default function RenderProducts(products) {
  if (products.length === 0) {
    return <p>Não há nenhum produto cadastrado ainda!</p>;
  }

  return products.map((product) => {
    return (
      <Container>
        <Title> {product.name}</Title>
        <Description>Data de fabricação: {product.fabricationDate}</Description>
        <Description>
          {product.perishable
            ? `Data de validade: ${product.validationDate}`
            : null}
        </Description>
        <Description> Preço: R$ {formatPrice(product.price)}</Description>
      </Container>
    );
  });
}

function formatPrice(price) {
  const formattedPrice = (price / 100).toFixed(2).replace(".", ",");
  return formattedPrice;
}
