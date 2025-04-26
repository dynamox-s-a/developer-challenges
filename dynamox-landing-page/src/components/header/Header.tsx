import styles from "./header.module.css";
import logo from "../../assets/logo_Dynamox 1.png";

const Header = () => {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Dynamox Logo" className={styles.logo} />
      <h1>
        Juntos por uma indústria <br />
        <span className={styles.title}>mais produtiva</span>
      </h1>
      <p className={styles.subtitle}>
        Esse manifesto é a consolidação da nossa missão de impactar
        positivamente o mercado de soluções para indústria com produtos de
        qualidade e conexão de ponta a ponta.
      </p>
    </header>
  );
};

export default Header;
