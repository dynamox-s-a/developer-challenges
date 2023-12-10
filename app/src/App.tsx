import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import store from "./redux/store";
import { createTheme } from "./shared/themes/MUI";
import { GlobalStyle } from "./shared/themes/globalStyle";

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
