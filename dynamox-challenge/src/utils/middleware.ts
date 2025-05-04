// src/utils/middleware.ts
import { Middleware } from 'redux';

export const authMiddleware: Middleware = store => next => async (action: any) => {
  if (action.type === 'LOGIN_REQUEST') {
    const { email, password } = action.payload;

    try {
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      const data = await response.json();

      if (data.length > 0 && data[0].password === password) {  
        const user = data[0];
        store.dispatch({ type: 'GET_USER', payload: user }); 
      } else {
        store.dispatch({ type: 'LOGIN_ERROR', payload: 'Usuário ou senha incorretos.' });
      }
    } catch (error) {
      store.dispatch({ type: 'LOGIN_ERROR', payload: 'Erro no login.' });
    }
  }

  return next(action);
};
