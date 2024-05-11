import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  padding: 1.875rem 2.6875rem 1.5rem 4.8125rem;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const ContainerLinks = styled.ol`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const Link = styled.li``;

export const Item = styled.a``;
