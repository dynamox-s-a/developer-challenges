import { AuthLayout } from "../components/auth/layout-comp";
import { CreateAccountForm } from "../components/auth/create-account-comp";
import type React from "react";

export default function CreateAccountPage(): React.JSX.Element {

  return (
      <AuthLayout>
        <CreateAccountForm />
      </AuthLayout>
  );
}
