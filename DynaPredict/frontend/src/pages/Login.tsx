import { AuthLayout } from "../components/auth/layout-comp";
import { LoginForm } from "../components/auth/login-comp";

export default function LoginPage(): React.JSX.Element {
  return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
  );
}
