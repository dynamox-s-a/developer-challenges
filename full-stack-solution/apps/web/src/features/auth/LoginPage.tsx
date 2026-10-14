import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { loginSchema, type LoginInput } from "@full-stack-solution/shared";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { FormTextField } from "@web/components/common/FormTextField";
import { paths } from "@web/routes/paths";
import { AuthLayout } from "./AuthLayout";
import { loginErrorDismissed, signIn } from "./auth.slice";

interface LocationState {
  from?: { pathname: string };
}

/**
 * Login screen.
 *
 * Validation reuses `loginSchema` from `libs/shared`, the same schema the API
 * validates against, so the rules cannot drift between client and server.
 */
export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { status, isSigningIn, error, expired } = useAppSelector(
    (state) => state.auth,
  );

  const { control, handleSubmit } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  if (status === "authenticated") {
    const from = (location.state as LocationState | null)?.from?.pathname;
    return <Navigate to={from ?? paths.overview} replace />;
  }

  const onSubmit = (values: LoginInput) => {
    void dispatch(signIn(values));
  };

  return (
    <AuthLayout>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign in</Typography>
          <Typography color="text.secondary" variant="body2">
            Use the credentials created by the database seed.
          </Typography>
        </Stack>

        {expired ? (
          <Alert severity="warning">
            Your session expired. Please sign in again.
          </Alert>
        ) : null}

        <ErrorAlert
          error={error}
          onDismiss={() => dispatch(loginErrorDismissed())}
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <FormTextField
              control={control}
              name="email"
              label="Email address"
              type="email"
              autoComplete="username"
            />
            <FormTextField
              control={control}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Button
              disabled={isSigningIn}
              size="large"
              type="submit"
              variant="contained"
            >
              {isSigningIn ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  );
}
