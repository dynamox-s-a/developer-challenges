import styles from "./headline.module.css";

const Headline = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Dynamox
        <span className={styles.titleSpan}>
          , por uma indústria mais segura e produtiva
        </span>
      </h3>
      <div>
        <p className={styles.text}>
          Em um mundo em que há crescimento na oferta de sensores e hardwares é
          normal que a escolha entre diferentes produtos seja um processo
          trabalhoso. Afinal, pesquisas e comparações tornam-se necessárias para
          entender as melhores opções para as respectivas aplicações.
        </p>

        <p className={styles.text}>
          Se essa escolha já parece complicada, ao acrescentarmos a questão da
          análise do software, a comparação se torna ainda mais complexa.
        </p>

        <p className={styles.text}>
          Uma forma de simplificar este processo é basear os critérios de
          análise em um sistema de referência. Esse manifesto é a consolidação
          da visão Dynamox: ser referência em tecnologias eficientes e eficazes
          para monitoramento, manutenção e performance de ativos.
        </p>
      </div>
    </div>
  );
};

export default Headline;
