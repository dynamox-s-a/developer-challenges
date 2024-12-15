import Image from "next/image";
import { Box } from "@mui/material";

const LoginBackgroundImage = () => {
  return (
    <Box
      flex="1"
      position="relative"
      height="100%"
      display={{ xs: "none", sm: "block" }}
    >
      <Image
        src="https://storage.googleapis.com/predict-webapp-public-assets/plt/login_page/showcase-background_v2.webp"
        alt="Wind Turbine Showcase"
        layout="fill"
        objectFit="cover"
        style={{
          borderRadius: "8px",
          opacity: 0.2,
        }}
      />
    </Box>
  );
};

export default LoginBackgroundImage;
