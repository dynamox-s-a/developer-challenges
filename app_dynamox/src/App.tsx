import { Outlet } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div>
                <Outlet />
            </div>
        </ThemeProvider>
    );
}

export default App
