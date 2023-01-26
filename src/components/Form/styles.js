import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 11px;

  .form__field {
    border: 0;
    outline: 0;
    font-family: "Raleway";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #454545;
    padding: 0px 0;
    width: 426px;
    height: 41px;
    background: #f4f7fc;
    border-radius: 5px;

    &::placeholder {
      color: #454545;
    }

    &:nth-child(4) {
      margin-bottom: 25px;
    }
  }

  .error {
    color: #fc8181;
    font-size: 15px;
    text-align: left;
    margin-top: 0.2rem;
    margin-bottom: 0.6rem;
  }

  .form__field.input-error,
  select.input-error {
    margin: 0px 0 5px 0;
    border-color: #fc8181;
  }

  @media (max-width: 767px) {
    .form__field {
    border-radius: 0px;
    width: 100vw;
    height: 61px;
  }
}
`;
