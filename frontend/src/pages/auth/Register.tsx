import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();

  return (
    <AuthForm
      title="Crie uma conta"
      buttonText="Registrar"
      linkText="Já possui uma conta?"
      linkTo="/auth/login"
      onSubmit={register}
      loading={loading}
    />
  );
}
