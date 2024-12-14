import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import LoginBackgroundImage from "@/components/LoginBackgroundImage";
import SignInForm from "./components/SignInForm";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/private");
    }
  };

  return (
    <Box height="100vh" display="flex">
      <LoginBackgroundImage />
      <Box
        m={8}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Image
          src="/logo-dynapredict.png"
          alt="Company Logo"
          width={202}
          height={32}
        />
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleLogin={handleLogin}
        />
        <Box />
      </Box>
    </Box>
  );
};

export default Login;
