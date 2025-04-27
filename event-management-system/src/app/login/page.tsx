"use client";

import Form from "@/components/form/Form";
import Image from "next/image";
import styles from "./login.module.css";

const Login = () => {
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
      <Form />
    </div>
  );
};

export default Login;
