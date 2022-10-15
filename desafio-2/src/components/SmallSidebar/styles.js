import styled from "styled-components";

export const SidebarAside = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }
`;
export const SidebarContainer = styled.div`
  z-index: 99;
  opacity: 1;
`;
export const ShowSidebarContainer = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  opacity: 0;
`;
export const Content = styled.div`
  background: var(--white);
  width: var(--fluid-width);
  height: 95vh;
  border-radius: var(--borderRadius);
  padding: 4rem 2rem;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border-color: transparent;
  font-size: 2rem;
  color: #000000;
  cursor: pointer;
`;
