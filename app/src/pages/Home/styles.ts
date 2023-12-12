import styled from "styled-components";

export const HomeContainer = styled.div`
  height: 100vh;
  overflow: hidden;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

export const ComponentContainer = styled.div`
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

export const MachineName = styled.p`
  font-weight: bold;
`;

export const MachineType = styled.p`
  font-size: 0.7rem;
  color: var(--grey-200)
`;

export const Machines = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 90%;
  position: relative;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
  }
`;

export const Points = styled.section``;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Avatar = styled.img`
  width: 4rem;
`;

export const MenuIcon = styled.img`
  width: 4rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
`;

export const ErrorMessage = styled.div`
  color: var(--red-100);
  font-size: 0.8rem;
  margin-top: 3%;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const Input = styled.section`
  width: fit-content;
  margin: 0 auto;
`;
