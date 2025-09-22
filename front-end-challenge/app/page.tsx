"use client";

import styles from "./page.module.css";
import LoginForm from "@/components/forms/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LoginFormCredentials } from "@/types";

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated, login, getRedirectRoute } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Se já estiver autenticado, redireciona para a página apropriada
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const redirectRoute = getRedirectRoute();
      router.push(redirectRoute);
    }
  }, [isAuthenticated, loading, router, getRedirectRoute]);

  const handleLogin = async (data: LoginFormCredentials) => {
    setLoginError(null);
    setIsLoggingIn(true);

    const result = await login({
      username: data.username,
      password: data.password,
    });

    if (result.success && result.redirectTo) {
      // Sucesso - redireciona para a página baseada na role
      router.push(result.redirectTo);
    } else {
      setLoginError(result.error || "Erro desconhecido durante login");
      setIsLoggingIn(false);
    }
  };

  // Se estiver carregando ou já autenticado, não mostra nada (evita flash)
  if (loading || isAuthenticated) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>Carregando...</div>
        </main>
      </div>
    );
  }

  // Mostra form de login
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.section}>
            <div className={styles.loginContainer}>
              {loginError && (
                <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
                  {loginError}
                </Alert>
              )}

              <LoginForm
                onSubmit={handleLogin}
                loading={isLoggingIn}
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
