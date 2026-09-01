import { afterEach, describe, expect, it, vi } from 'vitest';

import { getToken, setToken } from '../../api/client';
import {
  authReducer,
  initialAuthState,
  login,
  logout,
  restoreSession,
  selectCanMutate,
  sessionExpired,
} from './authSlice';
import { createStore } from '../../store';

const USER = { id: 'u1', email: 'analista@dynamox.local', name: 'Analista', role: 'ADMIN' as const };

afterEach(() => {
  vi.unstubAllGlobals();
  setToken(null);
});

describe('authSlice — reducer', () => {
  it('marca loading no login pendente e authenticated no sucesso', () => {
    let state = authReducer(initialAuthState, login.pending('r1', { email: 'a', password: 'b' }));
    expect(state.status).toBe('loading');

    state = authReducer(state, login.fulfilled(USER, 'r1', { email: 'a', password: 'b' }));
    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(USER);
  });

  it('guarda o erro quando o login falha', () => {
    const state = authReducer(
      initialAuthState,
      login.rejected(new Error('Credenciais inválidas.'), 'r1', { email: 'a', password: 'b' }),
    );
    expect(state.status).toBe('error');
    expect(state.error).toBe('Credenciais inválidas.');
    expect(state.user).toBeNull();
  });

  it('sessionExpired derruba a sessão e limpa o token', () => {
    setToken('jwt-qualquer');
    const authenticated = { status: 'authenticated' as const, user: USER, error: null };

    const state = authReducer(authenticated, sessionExpired());

    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
    expect(getToken()).toBeNull();
  });

  it('logout limpa usuário e estado', () => {
    const authenticated = { status: 'authenticated' as const, user: USER, error: null };
    const state = authReducer(authenticated, logout.fulfilled(undefined, 'r1', undefined));
    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
  });

  it('restoreSession sem usuário resulta em unauthenticated', () => {
    const state = authReducer(
      initialAuthState,
      restoreSession.fulfilled(null, 'r1', undefined),
    );
    expect(state.status).toBe('unauthenticated');
  });

  it('resultado obsoleto da restauração não derruba um login concluído no meio', () => {
    const authenticated = { status: 'authenticated' as const, user: USER, error: null };

    // Restauração pendente não volta para loading, e um fulfilled tardio nulo/stale
    // não pode desautenticar quem acabou de logar.
    let state = authReducer(authenticated, restoreSession.pending('r-velha', undefined));
    expect(state.status).toBe('authenticated');

    state = authReducer(state, restoreSession.fulfilled('stale', 'r-velha', undefined));
    expect(state.status).toBe('authenticated');

    state = authReducer(state, restoreSession.fulfilled(null, 'r-velha', undefined));
    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(USER);
  });
});

describe('authSlice — thunks contra a API', () => {
  it('login válido guarda o token e autentica', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ token: 'jwt-abc', user: USER }), { status: 200 }),
      ),
    );

    const store = createStore();
    await store.dispatch(login({ email: USER.email, password: 'Dynamox@2026' }));

    expect(store.getState().auth.status).toBe('authenticated');
    expect(getToken()).toBe('jwt-abc');
  });

  it('login inválido (401) vira estado de erro sem token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), { status: 401 }),
      ),
    );

    const store = createStore();
    await store.dispatch(login({ email: USER.email, password: 'errada' }));

    expect(store.getState().auth.status).toBe('error');
    expect(store.getState().auth.error).toBe('Credenciais inválidas.');
    expect(getToken()).toBeNull();
  });

  it('restaura a sessão via /auth/me quando há token guardado', async () => {
    setToken('jwt-guardado');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(USER), { status: 200 })),
    );

    const store = createStore();
    await store.dispatch(restoreSession());

    expect(store.getState().auth.status).toBe('authenticated');
    expect(store.getState().auth.user).toEqual(USER);
  });

  it('token guardado mas expirado resulta em unauthenticated e token limpo', async () => {
    setToken('jwt-expirado');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ message: 'Sessão inválida ou expirada.' }), { status: 401 }),
      ),
    );

    const store = createStore();
    await store.dispatch(restoreSession());

    expect(store.getState().auth.status).toBe('unauthenticated');
    expect(getToken()).toBeNull();
  });

  it('sem token guardado, restoreSession nem chama a API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const store = createStore();
    await store.dispatch(restoreSession());

    expect(store.getState().auth.status).toBe('unauthenticated');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('perfil da sessão', () => {
  it('o login guarda o perfil devolvido pela API', async () => {
    const store = createStore();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ token: 't', user: { ...USER, role: 'VIEWER' } }), { status: 201 })),
    );

    await store.dispatch(login({ email: USER.email, password: 'x' }));

    expect(store.getState().auth.user?.role).toBe('VIEWER');
    expect(selectCanMutate(store.getState())).toBe(false);
  });

  it('restaurar a sessão recupera o perfil — um refresh não rebaixa nem promove ninguém', async () => {
    setToken('token-existente');
    const store = createStore();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ...USER, role: 'VIEWER' }), { status: 200 })),
    );

    await store.dispatch(restoreSession());

    expect(store.getState().auth.status).toBe('authenticated');
    expect(store.getState().auth.user?.role).toBe('VIEWER');
  });

  it('ADMIN pode mutar; sem sessão, ninguém pode', async () => {
    const store = createStore();
    expect(selectCanMutate(store.getState())).toBe(false);

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ token: 't', user: USER }), { status: 201 })),
    );
    await store.dispatch(login({ email: USER.email, password: 'x' }));
    expect(selectCanMutate(store.getState())).toBe(true);

    await store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();
    expect(selectCanMutate(store.getState())).toBe(false);
  });
});
