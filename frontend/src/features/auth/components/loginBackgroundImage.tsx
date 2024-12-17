import Image from "next/image";
import { Box } from "@mui/material";
import loginBackground from "@/assets/background-login.webp";

const LoginBackgroundImage = () => {
  return (
    <Box flex="1" position="relative">
      <Image
        src={loginBackground}
        alt="Wind Turbine Background"
        quality={100}
        placeholder="blur"
        fill
        sizes="100vw"
        objectFit="cover"
      />
    </Box>
  );
};

export default LoginBackgroundImage;
