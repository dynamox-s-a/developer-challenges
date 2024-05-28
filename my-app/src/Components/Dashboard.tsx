import React from "react";
import styles from "../Styles/Dashboard.module.css";
import { PiEngineFill } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";

const Dashboard = ({ }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <PiEngineFill size={18} className={styles.icon} />
        Máquina 575983
      </div>
      <div className={styles.card}>
        <BiTargetLock size={18} className={styles.icon} />
        Ponto 20192
      </div>
      <div className={styles.card}>
        <img src="/Assets/RPM.PNG" alt="RPM Icon" className={styles.image} />
        200
      </div>
      <div className={styles.card}>
        <BiTargetLock size={18} className={styles.icon} />
        16g
      </div>
      <div className={styles.card}>
        <img src="/Assets/clock.PNG" alt="Clock Icon" className={styles.image} />
        20 min
      </div>
    </div>
  );
};

export default Dashboard;