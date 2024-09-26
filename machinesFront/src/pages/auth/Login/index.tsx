import { AuthContainer, Main } from "./styles.ts";
import { CustomInput } from "../../../components/Input";
import { CustomButton } from "../../../components/Button/CustomButton.tsx";
import { useState } from "react";
import { loginService } from "../../../services/userService.ts";
import { useAuth } from "../../../hooks/useAuth.ts";

export function Login() {
  const { signIn } = useAuth();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [validateForm, setValidForm] = useState({
    email: false,
    password: false,
  });

  async function handleClick(event) {
    event.preventDefault();

    try {
      const valid = checkValidForm();
      console.log("valid", valid);
      if (valid) {
        const { data } = await loginService(loginInfo);
        localStorage.setItem("jwt", data);
        signIn(data);
      }
    } catch (e) {
      console.error("e", e.message);
    }
  }

  function handleInputChange(identifier: string, value: string) {
    setLoginInfo((prevState) => {
      return { ...prevState, [identifier]: value };
    });
  }

  function checkValidForm() {
    const validation = {
      email: !loginInfo.email.includes("@"),
      password: loginInfo.password.length < 6,
    };
    setValidForm(validation);

    return !validation.email && !validation.password;
  }

  return (
    <form
      onSubmit={async (event) => {
        await handleClick(event);
      }}
    >
      <Main>
        <AuthContainer>
          <CustomInput
            label="Email"
            type="email"
            invalid={validateForm.email}
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
          <CustomInput
            label="Senha"
            type="password"
            invalid={validateForm.password}
            onChange={(event) =>
              handleInputChange("password", event.target.value)
            }
          />
          <CustomButton title="Entrar" type="submit" />
        </AuthContainer>
      </Main>
    </form>
  );
}
