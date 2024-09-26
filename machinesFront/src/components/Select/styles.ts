import styled from "styled-components";

export const Select = styled.select`
  width: ${({ width }) => width || "150px"};
  height: ${({ width }) => width || "2rem"};
  margin: 1rem;
  padding: 8px;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")};
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")};
  border-radius: 0.25rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  font-size: 16px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const StyledOption = styled.option`
  background-color: white;
  color: black;
`;
