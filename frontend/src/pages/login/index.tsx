import { Box } from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoginBackgroundImage from "@/features/auth/components/loginBackgroundImage";
import SignInForm from "@/features/auth/components/signInForm";
import Image from "next/image";
import LogoDynamox from "@/assets/logo-dynapredict.png";

const Login = () => {
  const { handleLogin, error } = useAuth();

  return (
    <Box height="100vh" display="flex">
      <LoginBackgroundImage />
      <Box
        width={{ xs: "100%", sm: "50%", lg: "25%" }}
        m={8}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Image src={LogoDynamox} alt="Company Logo" />
        <SignInForm handleLogin={handleLogin} error={error} />
        <Box />
      </Box>
    </Box>
  );
};

export default Login;
