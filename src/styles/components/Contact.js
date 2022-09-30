import styled from "styled-components";

export const ContactContainer = styled.section`
  background: #263252;
  min-height: 28.125rem;
  width: 100%;
  padding: 3rem 0;
`;

export const BoxContactTitle = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ContactTitle = styled.h1`
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 1.875em;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem;
  text-align: start;
  word-break: break-word;
`;

export const ContactForms = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const FormsInput = styled.input`
  margin: 0.3rem auto;
  width: 26.625rem;
  height: 2.563rem;
  border-radius: 0.3rem;
  align-items: center;
  text-align: center;
  font-family: "Raleway", sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2rem;
  font-size: 1em;
  color: #454545;
`;

export const FormsButton = styled.button`
  align-items: center;
  background: #0165db;
  border-radius: 0.3rem;
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  height: 2.5rem;
  margin: 1rem 0;
  text-align: center;
  width: 11.5rem;
  cursor: pointer;
`;
