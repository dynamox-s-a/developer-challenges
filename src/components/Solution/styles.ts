import styled from "styled-components";
import Background from "../../assets/background.png";

export const Container = styled.section`
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 720px;

  @media (max-width: 768px) {
    height: 620px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;

    .image-notebook {
      width: 350px;
    }
  }
`;

export const ContainerText = styled.div`
  padding-left: 6rem;

  @media (max-width: 768px) {
    padding-left: 2rem;
  }
`;

export const Title = styled.h2`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 2rem;

  color: ${({ theme }) => theme.COLORS.WHITE};

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;
