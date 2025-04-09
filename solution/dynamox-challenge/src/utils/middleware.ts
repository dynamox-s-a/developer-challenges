import { Middleware } from 'redux';

export const authMiddleware: Middleware = store => next => async (action: any) => {
  // Deixa a action original seguir o fluxo normalmente
  const result = next(action);

  if (action.type === 'LOGIN_REQUEST') {
    const { username, password } = action.payload;

    try {
      const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
      const data = await response.json();

      if (data.length > 0) {
        store.dispatch({ type: 'GET_USER', payload: username });
      } else {
        store.dispatch({ type: 'LOGIN_ERROR', payload: 'Usuário ou senha incorretos.' });
      }
    } catch (error) {
      store.dispatch({ type: 'LOGIN_ERROR', payload: 'Erro no login.' });
    }
  }

  return result;
};
