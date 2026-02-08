import { StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import RequireAuth from './routes/RequireAuth';
import Login from './pages/Login';
import Machines from './pages/Machines';
import MonitoringPoints from './pages/MonitoringPoints';
import MonitoringPointDetail from './pages/MonitoringPointDetail';
import AppLayout from './layout/AppLayout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<RequireAuth />}>
                        <Route element={<AppLayout />}>
                            <Route
                                path="/"
                                element={<Navigate to="/machines" replace />}
                            />
                            <Route
                                path="/machines"
                                element={<Machines />}
                            />
                            <Route
                                path="/monitoring-points"
                                element={<MonitoringPoints />}
                            />
                            <Route
                                path="/monitoring-points/:id"
                                element={<MonitoringPointDetail />}
                            />
                        </Route>
                    </Route>

                    <Route
                        path="*"
                        element={<Navigate to="/machines" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
