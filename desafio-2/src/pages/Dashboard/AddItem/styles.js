import styled from "styled-components";

export const Section = styled.section`
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem 4rem;
`;
export const Form = styled.form`
  border-radius: 10px;
  background-color: #ffffff;
  margin: auto;
  text-align: center;
  width: 900px;
  box-shadow: none;
  padding: 0;
  @media (max-width: 992px) {
    width: 500px;
  }
`;
export const FormCenter = styled.div`
  border-radius: 10px;
  padding: 3rem;
  display: grid;

  row-gap: 0.5rem;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    column-gap: 1rem;
  }
`;
export const BtnContanier = styled.div`
  display: flex;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  align-self: flex-end;
  margin-top: 0.5rem;
`;
