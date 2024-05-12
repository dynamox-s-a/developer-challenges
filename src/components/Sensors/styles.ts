import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_400};
  color: ${({ theme }) => theme.COLORS.BLACK};
`;

export const Title = styled.h2`
  text-align: center;
  padding-top: 6rem;
  margin-bottom: 2rem;

  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const Text = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.COLORS.GRAY};

  width: 1200px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    width: initial;
    padding: 0 1rem;
  }
`;

export const Button = styled.button`
  margin-top: 1.75rem;
  padding: 0.3rem 2rem;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.WHITE};

  border: none;
`;

export const TypeSensors = styled.div`
  margin: 2rem 0rem;
  display: flex;
  align-items: center;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;

    .image-sensors {
      width: 180px;
    }
  }
`;
