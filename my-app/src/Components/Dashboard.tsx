import React from "react";
import styles from "../Styles/Dashboard.module.css";
import { PiEngineFill } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import { IMachine } from "../Types/Machine";
import { ReactSVG } from "react-svg";
import rpm from '../Assets/RPM.svg';
import clock from '../Assets/clock.svg';
import range from '../Assets/range.svg';

interface DashboardProps {
  data?: IMachine[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {

  if (!data || data.length === 0) {
    return <div className={styles.container}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <PiEngineFill size={18} className={styles.icon} />
        {data[0]?.machine}
      </div>
      <div className={styles.card}>
        <BiTargetLock size={18} className={styles.icon} />
        {data[0]?.point}
      </div>
      <div className={styles.card}>
        <ReactSVG src={rpm} />
        {data[0]?.rpm}
      </div>
      <div className={styles.card}>
        <ReactSVG src={range} />
        {data[0]?.diff}
      </div>
      <div className={styles.card}>
        <ReactSVG src={clock} />
        {data[0]?.time}
      </div>
    </div>
  );
};

export default Dashboard;