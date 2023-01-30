import { Container, Title, Description } from "./styles";
import formatPrice from "../../utils/formatPrice";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useNavigate } from "react-router-dom";
import formatDateRender from "../../utils/formatDateRender";

export default function RenderProducts(products) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return;
  }

  return products.map((product, index) => {
    return (
      <Container key={index}>
        <Title>
          {product.name}

          <BorderColorIcon
            className="editIcon"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          />
        </Title>
        <Description>
          Data de fabricação: {formatDateRender(product.fabricationDate)}
        </Description>
        <Description>
          {product.perishable
            ? `Data de validade: ${formatDateRender(product.expirationDate)}`
            : null}
        </Description>
        <Description> Preço: R$ {formatPrice(product.price)}</Description>
      </Container>
    );
  });
}
