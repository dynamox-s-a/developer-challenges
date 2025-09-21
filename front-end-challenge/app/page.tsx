"use client";

import styles from "./page.module.css";
import LoginForm, { LoginFormData } from "@/components/forms/LoginForm";

export default function Home() {
  const handleLogin = (data: LoginFormData) => {
    console.log("Login attempt:", data);
    // Aqui você adicionaria a lógica de autenticação
    // Exemplo: router.push('/dashboard')
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.section}>
            <div className={styles.loginContainer}>
              <LoginForm
                onSubmit={handleLogin}
                title="Event Management System"
                className={styles.loginForm}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
