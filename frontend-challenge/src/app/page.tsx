import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Bem-vindo à Plataforma de Eventos</h1>
          <p>
            Gerencie seus eventos de forma simples e eficiente. Crie, organize e
            acompanhe todos os seus eventos em um só lugar.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Faça login para começar a gerenciar seus eventos agora mesmo.
          </p>
          <div className={styles.ctas}>
            <Link href="/login" className={styles.primary}>
              Ir para Login
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

