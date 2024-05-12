import styled from "styled-components";
interface MenuIconProps {
  isOpen: boolean;
}

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.875rem 2.6875rem 1.5rem 4.8125rem;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.WHITE};

  @media (max-width: 768px) {
    padding: 0.875rem 2.6875rem 1.5rem 1.8125rem;
  }
`;

export const ContainerLinks = styled.ol<MenuIconProps>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 95px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

export const Link = styled.li`
  width: 100%;
`;

export const Item = styled.a`
  color: ${({ theme }) => theme.COLORS.WHITE};
  padding: 10px;
  font-size: 18px;
  display: block;
  width: 100%;
  text-align: center;
`;

export const HamburguerMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MenuIcon = styled.div<MenuIconProps>`
  width: 30px;
  height: 3px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  cursor: pointer;
  position: relative;

  &::after,
  &::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 3px;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    transition: all 0.3s;
  }

  &::before {
    transform: ${({ isOpen }) =>
      isOpen ? "rotate(-45deg) translate(0px, 0px)" : "translateY(-1px)"};
  }

  &::after {
    transform: ${({ isOpen }) =>
      isOpen ? "rotate(45deg) translate(0px, 0px)" : "translateY(10px)"};
  }

  @media (max-width: 768px) {
    background-color: transparent;
  }
`;
