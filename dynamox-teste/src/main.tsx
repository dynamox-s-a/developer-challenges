import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.scss'
import { store } from './Store/store.ts'
import { Provider } from 'react-redux'

// Rotas
import Home from './Router/Home/Home.tsx'
import Data from './Router/Data/Data.tsx'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/data" element={<Data />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
