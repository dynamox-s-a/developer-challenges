import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { GlobalStyle } from "./shared/themes/globalStyle";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { createTheme } from "./shared/themes/MUI";

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/monitoring" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
