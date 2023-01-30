import { useNavigate } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Container, Title, Description } from "./styles";
import formatPrice from "../../utils/formatPrice";
import formatDateRender from "../../utils/formatDateRender";

export default function RenderProducts(products) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return;
  }

  return products.map(
    (
      { name, id, fabricationDate, expirationDate, perishable, price },
      index
    ) => {
      return (
        <Container key={index}>
          <Title>
            {name}

            <BorderColorIcon
              className="editIcon"
              onClick={() => navigate(`/products/${id}/edit`)}
            />
          </Title>
          <Description>
            Data de fabricação: {formatDateRender(fabricationDate)}
          </Description>
          <Description>
            {perishable
              ? `Data de validade: ${formatDateRender(expirationDate)}`
              : null}
          </Description>
          <Description> Preço: R$ {formatPrice(price)}</Description>
        </Container>
      );
    }
  );
}
