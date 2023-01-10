/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, InputBase } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import {
  setUserEmail,
  setUserPassword,
  fetchUserInfo,
} from "../../redux/reducers/userInfo";
import "./login.css";
import { IUser } from "../../redux/interfaces/IUser";
import { setLocalStorage } from "../../helpers/localStorage";
import { IWrongInfo } from "../../interfaces/IWrongInfo";
import { LoginErrorAlert } from "../../components/loginErrorAlert";
import { useNavigate } from "react-router-dom";

export default function Login(): JSX.Element {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isWrongInfo, setWrongInfo] = useState<IWrongInfo>({
    isError: false,
    message: "",
  } as IWrongInfo);

  const { email, password } = useAppSelector((state) => state.userInfoSlice);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangeInfoLogin = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    switch (event.target.name) {
      case "userEmail":
        dispatch(setUserEmail(event.target.value));
        break;
      case "userPassword":
        dispatch(setUserPassword(event.target.value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const emailRegex = /\S+@\S+\.\S+/;
    const emailIsValid = emailRegex.test(email);
    const MIN_LENGHT_PASSWORD = 6;

    if (!emailIsValid || password.length < MIN_LENGHT_PASSWORD) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email, password]);

  const handleLogin = async (): Promise<IUser | any> => {
    try {
      const userInfo = await dispatch(
        fetchUserInfo({ email, password })
      ).unwrap();

      setLocalStorage("user", userInfo.token);
      navigate("/userDashboard");
    } catch (error) {
      setWrongInfo({
        isError: true,
        message: String(error),
      });

      setTimeout(() => {
        setWrongInfo({
          isError: false,
          message: "",
        });

        dispatch(setUserEmail(""));
        dispatch(setUserPassword(""));
      }, 10000);
    }
  };

  return (
    <Box component="section" sx={{ width: "100vw", height: "100vh" }}>
      <Box className="loginBox">
        <Typography variant="h4" component="h1">
          Seja bem-vindo!
        </Typography>

        <Box component="form" className="formBox">
          <InputBase
            placeholder="Email"
            type="text"
            name="userEmail"
            value={email}
            onChange={handleChangeInfoLogin}
            className="loginInput"
          />

          <InputBase
            placeholder="Password"
            type="password"
            name="userPassword"
            value={password}
            onChange={handleChangeInfoLogin}
            className="loginInput"
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleLogin as unknown as () => void}
          >
            Entrar
          </Button>
        </Box>
      </Box>

      {isWrongInfo.isError && (
        <LoginErrorAlert errorMessage={isWrongInfo.message} />
      )}
    </Box>
  );
}
