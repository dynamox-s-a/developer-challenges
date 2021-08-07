import styled from "styled-components";


const MyButton = styled.button`
  width: ${(props) => {
    if (props.setSize === "huge") {
      return "180px";
    } else if (props.setSize === "giant") {
      return "300px";
    } else if (props.setSize === "large") {
      return "100px";
    } else if (props.setSize === "medium") {
      return "70px";
    } else {
      return "50px";
    }
  }};
  height: ${(props) => {
    if (props.setSize === "huge") {
      return "45px";
    } else if (props.setSize === "giant") {
      return "50px";
    } else if (props.setSize === "large") {
      return "40px";
    } else if (props.setSize === "medium") {
      return "30px";
    } else {
      return "30px";
    }
  }};
  background-color: ${(props) => props.setColor};
  color: white;
  border: none;
  border-radius: 5px;
  margin: 5px;
  font-weight: bold;
  font-family: "Carrois Gothic", sans-serif;
  font-size: ${(props) => {
    if (props.setSize === "huge") {
      return "1.3rem";
    } else if (props.setSize === "giant") {
      return "1.3rem";
    } else if (props.setSize === "large") {
      return "1.3rem";
    } else if (props.setSize === "medium") {
      return "0.7rem";
    } else {
      return "0.5rem";
    }
  }};
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  transition: 0.2s;
  :hover {
    opacity: 50%;
  }
`;
export default MyButton;
