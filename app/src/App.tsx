import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { GlobalStyle } from "./shared/themes/globalStyle";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { createTheme } from "./shared/themes/MUI";
import store from "./redux/store";

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path="/monitoring" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
