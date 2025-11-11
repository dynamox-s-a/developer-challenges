import React, { Suspense } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth-slice";
import { useNavigate } from "react-router-dom";
// Lazy-load the PasswordField to reduce initial bundle size.
const PasswordField = React.lazy(() =>
  import("./password-field").then((mod) => ({ default: mod.PasswordField }))
);
import { type RootState, store } from "../../features/store";

type LoginFormValues = { email: string; password: string };

export function LoginForm(): React.JSX.Element {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { access_token, refresh_token, isLogged } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: "dynamox@email.com", password: "123456789" },
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values: LoginFormValues): Promise<void> => {
      setIsPending(true);
      try {
        await dispatch(loginUser(values)).unwrap();
      } catch (error) {
        setError(String(error));
      } finally {
        setIsPending(false);
      }
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (isLogged && access_token && refresh_token) {
      navigate("/dashboard/");
    }
  }, [isLogged, access_token, refresh_token, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1, width: "100%" }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 2,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockOutlinedIcon sx={{ mr: 1 }} /> Entrar
      </Typography>

      <Controller
        name="email"
        control={control}
        rules={{ required: "E-mail é obrigatório" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="email-login"
            label="E-mail"
            type="email"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: "Senha é obrigatória" }}
        render={({ field, fieldState }) => (
          <Suspense
            fallback={
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="password-login"
                label="Senha"
                type="password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            }
          >
            <PasswordField
              {...field}
              margin="normal"
              required
              fullWidth
              id="password-login"
              label="Senha"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          </Suspense>
        )}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </Button>

      <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
        <Button variant="text" href="/register" size="small">
          Não tem conta? Crie uma!
        </Button>
      </Box>
    </Box>
  );
}
