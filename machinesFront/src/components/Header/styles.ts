import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #e8f1f4;

  @media (max-width: 1350px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const NavBar = styled.nav`
  padding: 10px;
  margin-left: 2%;
  user-select: none;

  li {
    display: flex;
    height: 4vh;
    justify-content: center;
    align-items: center;
    border-bottom: 3px solid #e8f1f4;
    border-radius: 10%;
    padding: 5px 20px 5px 20px;
    color: black;
    font-size: 18px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;

    @media (max-width: 1350px) {
      font-size: 16px;
    }
    @media (max-width: 1000px) {
      padding: 5px 10px 5px 10px;
    }
  }
  li:hover {
    background-color: #e8f1f4;
  }

  @media (max-width: 1350px) {
    margin: 0;
  }
`;

export const NavBarList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1vw;
`;
