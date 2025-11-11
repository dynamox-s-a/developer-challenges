import React, { Suspense } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  type TextFieldProps,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { authClient } from "../../services/auth-client";
import { useNavigate } from "react-router-dom";
// Lazy-load PasswordField to reduce initial bundle size for auth pages
const PasswordField = React.lazy(async () => {
  const mod = await import("./password-field");
  // the password-field module exports a named `PasswordField` component
  return {
    default: mod.PasswordField,
  } as { default: React.ComponentType<TextFieldProps> };
});

type CreateAccountValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function CreateAccountForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<CreateAccountValues>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setError(null);
    if (data.password !== data.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await authClient.createAccount({
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        setError(res.error);
      } else {
        navigate("/login");
      }
    } catch {
      setError("Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

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
        <PersonAddOutlinedIcon sx={{ mr: 1 }} /> Criar Conta
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
            id="email-signup"
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
                id="password-signup"
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
              id="password-signup"
              label="Senha"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          </Suspense>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{ required: "Confirmação de senha é obrigatória" }}
        render={({ field, fieldState }) => (
          <Suspense
            fallback={
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="confirm-password-signup"
                label="Confirmar Senha"
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
              id="confirm-password-signup"
              label="Confirmar Senha"
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
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Conta"}
      </Button>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="text" href="/login" size="small">
          Já tem uma conta? Faça login!
        </Button>
      </Box>
    </Box>
  );
}
