import { Container } from "./styles";
import logo from "../../assets/logo-dynamox.png"
const Header = () => {
  return (
    <Container>
      <div className="left">
        <a href="https://dynamox.net/"><img src={logo} alt="description of z\xz\x"/></a>
      </div>


      <div className="right">
        <a href="https://dynamox.net/dynapredict/"><h3>DynaPredict</h3></a>
        <a href="https://dynamox.net/"><h3>Sensores</h3></a>
        <a href="https://dynamox.net/"><h3>Contato</h3></a>
      </div>
    </Container>
  );
};

export default Header;