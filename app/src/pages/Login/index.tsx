import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import ErrorIcon from "@mui/icons-material/Error";
import Logo from "@assets/logo.png";
import { SubmitHandler, useForm } from "react-hook-form";
import LoginImage from "@assets/Example.png";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/store/users/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { FetchStatus } from "../../redux/types";
import { IUserLogin } from "../../redux/store/users/types";
import * as St from "./styles";

export default function Login() {
  const navigate = useNavigate();
  const { handleSubmit, register, formState } = useForm<IUserLogin>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const errors = formState.errors;
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const dispatch = useDispatch<AppDispatch>();
  const fetchStatus = useSelector((state: RootState) => state.user.status);

  const userLogin: SubmitHandler<IUserLogin> = async ({ email, password }) => {
    dispatch(fetchUser({ email, password }));
  };

  useEffect(() => {
    fetchStatus === FetchStatus.succeeded && navigate("/monitoring");
  }, [fetchStatus, navigate]);

  return (
    <St.Container>
      <St.Login>
        <St.Logo src={Logo} alt="Logo" />
        <St.Form autoComplete="off" onSubmit={handleSubmit(userLogin)}>
          <section>
            <FormControl variant="standard">
              <InputLabel htmlFor="email">E-mail</InputLabel>
              <Input
                error={!!errors.email}
                autoComplete="off"
                {...register("email", {
                  required: "Este campo é obrigatório",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Insira um e-mail válido",
                  },
                })}
                name="email"
                id="email"
                endAdornment={
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors.email && (
              <St.ErrorMessage>
                <ErrorIcon color="error" fontSize="small" />
                <p>{errors.email.message}</p>
              </St.ErrorMessage>
            )}
          </section>
          <section>
            <FormControl variant="standard">
              <InputLabel htmlFor="password">Senha</InputLabel>
              <Input
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                autoComplete="off"
                {...register("password", {
                  required: "Este campo é obrigatório",
                })}
                name="password"
                id="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors.password && (
              <St.ErrorMessage>
                <ErrorIcon color="error" fontSize="small" />
                <p>{errors.password.message}</p>
              </St.ErrorMessage>
            )}
          </section>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </St.Form>
      </St.Login>
      {window.innerWidth >= 1024 && (
        <St.LoginImage src={LoginImage} alt="Imagem modelo do sistema" />
      )}
    </St.Container>
  );
}
