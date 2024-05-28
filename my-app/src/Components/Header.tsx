import React from "react";
import styles from "../Styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.title}>
        Análise de Dados
      </div>
    </header>
  );
};

export default Header;