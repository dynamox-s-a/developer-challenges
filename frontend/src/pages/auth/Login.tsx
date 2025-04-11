import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();

  return (
    <AuthForm
      title="Entrar"
      buttonText="Entrar"
      linkText="Não possui uma conta?"
      linkTo="/auth/register"
      onSubmit={login}
      loading={loading}
    />
  );
}
