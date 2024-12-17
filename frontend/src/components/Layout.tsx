import { ReactNode } from "react";
import { Container } from "@mui/material";
import NavBar from "./navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{ my: "3rem" }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
