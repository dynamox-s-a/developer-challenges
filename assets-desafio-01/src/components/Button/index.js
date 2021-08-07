import MyButton from "./styles";

const Button = ({ children, setColor, setSize, setClick }) => {
  return (
    <MyButton setColor={setColor} onClick={setClick} setSize={setSize}>
      {children}
    </MyButton>
  );
};
export default Button;
