import styled from "styled-components";

export const Container = styled.main`
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_300};
`;

export const Header = styled.header`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-bottom: 1px solid #dfe3e8;
  padding: 1rem 1.5rem 1rem 1.5rem;
  font-weight: 500;
`;

export const ContainerGraphic = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  padding: 2rem 2rem;
  margin: 2rem;
  border: 1px solid #dfe3e8;
`;
