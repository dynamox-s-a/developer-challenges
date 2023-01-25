import MuiButton from "@mui/material/Button";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Button({ variant = "contained", children, ...props }) {
  return (
    <ThemeProvider theme={theme}>
      <StyledMuiButton variant={variant} {...props}>
        {children}
      </StyledMuiButton>
    </ThemeProvider>
  );
}

const StyledMuiButton = styled(MuiButton)`
  width: 183px;
  height: 39px;
  margin-top: 10px !important;
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;
  color: #ffffff;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: "#0165DB",
    },
    secondary: {
      main: "#263252",
    },
  },
});
