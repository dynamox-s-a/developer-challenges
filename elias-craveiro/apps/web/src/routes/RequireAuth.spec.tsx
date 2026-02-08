import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RequireAuth } from './RequireAuth';

describe('RequireAuth', () => {
    
    it('redirects to /login when no token', async () => {
        const store = configureStore({ reducer: { auth: authReducer } });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/machines']}>
                    <Routes>
                        <Route path="/login" element={<div>LOGIN</div>} />
                        <Route
                            path="/machines"
                            element={
                                <RequireAuth>
                                    <div>PRIVATE</div>
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>,
        );

        expect(screen.getByText('LOGIN')).toBeInTheDocument();
    });
});
