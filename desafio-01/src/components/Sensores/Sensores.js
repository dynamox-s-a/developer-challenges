import styles from './Sensores.module.css'

import TCA from '../../imagens/sensor-tca.png';
import AS from '../../imagens/sensor-as.png';
import HF from '../../imagens/sensor-hf.png';
import Button from '../Button/Button.js';

const Sensores = () => {
  return (
    <section id="SensoresSection" className={styles.sensores_container}>
      <div className={styles.sensores_content}>
        <h2 className={styles.sensores_content_subtitle}>Sensores para Manutenção Preditiva</h2>
        <p className={styles.sensores_content_text}>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <Button className={styles.sensores_content_button}><a href="https://dynamox.net/dynapredict/" className={styles.sensores_content_link} target="_blank" rel="noreferrer">VER MAIS</a></Button>
      </div>
      <div className={styles.tipos_sensores}>
        <div className={styles.tipos_sensores_item}>
          <img src={TCA} className={styles.sensores_img} alt="sensor-TCA" />
          <p className={styles.sensores_nome}>TcA+</p>
        </div>
        <div className={styles.tipos_sensores_item}>
          <img src={AS} className={styles.sensores_img} alt="sensor-AS" />
          <p className={styles.sensores_nome}>AS</p>
        </div>
        <div className={styles.tipos_sensores_item}>
          <img src={HF} className={styles.sensores_img} alt="sensor-HF" />
          <p className={styles.sensores_nome}>HF</p>
        </div>
      </div>
    </section>
  );
}
export default Sensores
