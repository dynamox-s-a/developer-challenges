import styled from "styled-components";

export const Container = styled.main`
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_300};
`;

export const Header = styled.header`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-bottom: 1px solid #dfe3e8;
  padding: 1rem 1.5rem 1rem 1.5rem;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem 2rem 0 2rem;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border: 1px solid #dfe3e8;

  padding: 0.5rem 2rem;
  border-radius: 5px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  border: none;
  background-color: transparent;
  font-size: 0.875rem;

  img {
    width: 15px;
  }

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

export const Divider = styled.div`
  rotate: 90deg;
  background-color: #dfe3e8;
  height: 1px;
  width: 15px;
`;

export const ContainerGraphic = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  padding: 2rem 2rem;
  margin: 2rem;
  border: 1px solid #dfe3e8;
`;
