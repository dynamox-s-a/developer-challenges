import styled from "styled-components";
import Background from "../../assets/background.png";

export const Container = styled.section`
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 720px;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerText = styled.div`
  padding-left: 6rem;
`;

export const Title = styled.h2`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 2rem;

  color: ${({ theme }) => theme.COLORS.WHITE};
`;
