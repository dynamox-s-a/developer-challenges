import LoginForm from "@/components/loginForm"
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fffff",
      }}
    >
      <LoginForm />
    </Box>
  );
}