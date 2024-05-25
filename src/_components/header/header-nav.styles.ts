import styled from '@emotion/styled'
import { Link } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`

export const LinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #4B4b4b;

  &:hover {
    opacity: 0.6;
  }

  &:active {
    font-weight: 600;
  }
`

export const MenuIconStyled = styled(MenuIcon)`
  cursor: pointer;
  color: ${props => props.theme.palette.primary.main};

  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 0.3;
  }
`