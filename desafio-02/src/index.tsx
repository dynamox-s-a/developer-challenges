import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Home } from "./features/home/Home";
import { ListarProdutosPage } from "./pages/produtos/ListarProdutos";
import { CriarProdutoPage } from "./pages/produtos/CriarProdutoPage";
import { EditarProdutoPage } from "./pages/produtos/EditarProdutoPage";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/produtos",
    element: <ListarProdutosPage />,
  },
  {
    path: "/produtos/criar",
    element: <CriarProdutoPage />,
  },
  {
    path: "/produtos/editar",
    element: <EditarProdutoPage />,
  },
]);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
