import { Container } from "./styles";

const Input = ({ error, name, register, setHeight, setWidth, ...rest }) => {
  return (
    <Container>
      <input {...register(name)} {...rest} />
      <div>{error}</div>
    </Container>
  );
};

export default Input;