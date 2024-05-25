import styled from "@emotion/styled";

export const ModalContainer = styled.div`
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  position: fixed;
  display: flex;
  flex-direction: column;
  background: #692746;
  overflow: hidden;
  padding: 32px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    height: 58px;

    span {
      color: white;
      font-size: 2rem;
    }

    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      
      svg {
        color: white;
      }
      
      &:hover {
        color: white;
        opacity: 0.2;
        transition: opacity 0.3s;
      }

      &:active {
        animation: rotateAnimation 0.1s linear;
        opacity: 0.2;
      }
      
      @keyframes rotateAnimation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(90deg);
        }
      }
    }
  } 
`

export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    text-decoration: none;
    color: white;
  
    font-size: 1.5rem;
    font-weight: 400;

    &:hover {
      background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,1));
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  } 

  .activeLink {
    background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,1));
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`