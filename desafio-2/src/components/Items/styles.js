import styled from "styled-components";

export const ItemContanier = styled.article`
  background: #ffffff;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
`;
export const Header = styled.header`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--grey-100);
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
`;
export const Title = styled.h2`
  color: #000000;
  font-weight: 700;
`;

export const InfoContanier = styled.div`
  display: flex;
  align-items: center;
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
export const Propriedade = styled.p`
  color: #000000;
  margin: 1rem;
`;

export const Nome = styled.p`
  color: #000000;
  margin: 1rem;
  font-size: 30px;
`;
