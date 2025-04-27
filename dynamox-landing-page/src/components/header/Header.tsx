import styles from "./header.module.css";
import logo from "../../assets/logo_Dynamox 1.png";
import Slider from "../slider/Slider.tsx";
import Headline from "../headline/Headline.tsx";
import { Title } from "../title/Title.tsx";

const Header = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Dynamox Logo" className={styles.logo} />
        <Title />
        <p className={styles.subtitle}>
          Esse manifesto é a consolidação da nossa missão de impactar
          positivamente o mercado de soluções para indústria com produtos de
          qualidade e conexão de ponta a ponta.
        </p>
      </header>
      <Slider />
      <Headline />
    </div>
  );
};

export default Header;
