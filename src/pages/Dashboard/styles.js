import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 10px;
  width: 80vw;
  border-radius: 10px;
  background-color: #fff;

  button,
  p {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #7d92e8;
    font-weight: 700;
  }
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #fff9;
  padding: 20px;
  border-radius: 20px;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 80vw;
  min-height: 200px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 35px;
  color: #7d92e8;
  width: 100%;
`;

export const Description = styled.h6`
  font-size: 20px;
  margin-bottom: 8px;
  color: #5b5b5b;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;
  /* padding: 20px; */
  width: 80vw;
  font-size: 18px;
  border-radius: 20px;
  color: #7d92e8;
  font-weight: 700;

  p,
  a {
    padding: 20px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    line-height: 20px;
    border-radius: 15px;
    margin-bottom: 40px;
    text-decoration: none;
    cursor: pointer;
  }
`;
