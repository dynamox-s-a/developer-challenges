import styles from './Sensors.module.css'

import TCA from '../../images/sensor-tca.png';
import AS from '../../images/sensor-as.png';
import HF from '../../images/sensor-hf.png';
import Button from '../Button/Button.js';

const Sensors = () => {
  return (
    <section id="SensorsSection" className={styles.sensors_container}>
      <div className={styles.sensors_content}>
        <h2 className={styles.sensors_content_subtitle}>Sensors para Manutenção Preditiva</h2>
        <p className={styles.sensors_content_text}>
          Opções de sensors sem fio, ou DynaLoggers com sensors de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <Button className={styles.sensors_content_button}><a href="https://dynamox.net/dynapredict/" className={styles.sensors_content_link} target="_blank" rel="noreferrer">VER MAIS</a></Button>
      </div>
      <div className={styles.sensors_types}>
        <div className={styles.sensors_types_item}>
          <img src={TCA} className={styles.sensors_img} alt="sensor-TCA" />
          <p className={styles.sensors_name}>TcA+</p>
        </div>
        <div className={styles.sensors_types_item}>
          <img src={AS} className={styles.sensors_img} alt="sensor-AS" />
          <p className={styles.sensors_name}>AS</p>
        </div>
        <div className={styles.sensors_types_item}>
          <img src={HF} className={styles.sensors_img} alt="sensor-HF" />
          <p className={styles.sensors_name}>HF</p>
        </div>
      </div>
    </section>
  );
}
export default Sensors;
