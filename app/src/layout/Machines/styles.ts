import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 78%;
  position: relative;

  @media (min-width: 1024px) {
    width: 79%;
    height: 96%;
  }
`;

export const Title = styled.p`
  color: var(--blue-400);
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

export const Machines = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 90%;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Avatar = styled.img`
  width: 4rem;
`;
