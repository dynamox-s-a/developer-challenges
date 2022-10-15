import styled from "styled-components";

export const Section = styled.div`
  margin-top: 4rem;
`;
export const Titulo = styled.h3`
  font-weight: 700;
`;
export const LocalItens = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2rem;
  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;
