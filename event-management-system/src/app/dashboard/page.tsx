"use client";

import Image from "next/image";
import styles from "../login/login.module.css";

const Events = () => {
  return (
    <div className={styles.loginContainer}>
      <Image
        src="/logo_Dynamox 2.png"
        alt="Dynamox Logo"
        width={180}
        height={80}
        className={styles.logo}
        priority
      />
      <p style={{ color: "white" }}>DASHBOARD</p>
    </div>
  );
};

export default Events;
