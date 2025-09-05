import "./App.css";
import MainLayout from "./layouts/MainLayout";
import { AppRoutes } from './router/app.routes';
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
