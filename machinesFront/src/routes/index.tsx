import { AuthRoutes } from "./AuthRoutes.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { AppRoutes } from "./AppRoutes.tsx";
import { Header } from "../components/Header";

export function Routes() {
  const { user } = useAuth();

  if (!!user) {
    return (
      <>
        <Header />
        <AppRoutes />
      </>
    );
  }

  return <AuthRoutes />;
}
