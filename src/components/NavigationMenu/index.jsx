import Logo from "../../assets/logo-dynamox.png";

import "./index.scss";

export default function NavigationMenu() {
  return (
    <nav className="navStyles">
      <div className="divMain">
        <a href="https://dynamox.net/" target="_blank">
          <img src={Logo} alt="Dynamox" />
        </a>
      </div>
      <div className="menu">
        <a
          className="pointer"
          href="https://dynamox.net/dynapredict/"
          target="_blank"
        >
          DynaPredict
        </a>
        <a className="pointer" href="#sensors">
          Sensores
        </a>
        <a className="pointer" href="#contact">
          Contato
        </a>
      </div>
    </nav>
  );
}
