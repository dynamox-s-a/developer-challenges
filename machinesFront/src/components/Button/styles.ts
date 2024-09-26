import styled from "styled-components";

export const Button = styled.button`
  width: 15vw;
  max-width: 200px;
  max-height: 50px;
  height: 3vh;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0.25rem;
  color: #1f2937;
  background-color: ${({ $delete }) => ($delete ? "#E53C3CFF" : "#0FDCDCFF")};
  border: none;

  &:hover {
    background-color: #939393;
  }
`;
