import { ReactNode } from "react";
import { Container, Box } from "@mui/material";
import NavBar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <NavBar />
      <Container sx={{ marginTop: 3 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
