import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  opacity: 1;
  text-decoration: none;
  color: #4B4b4b;

  &:hover {
    opacity: 0.7;
  }

  &.active {
    opacity: 0.4;
  }
`