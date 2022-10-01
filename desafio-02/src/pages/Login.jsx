import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { signIn } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false)

  const register = async (event) => {
    event.preventDefault();

    try {
      await signIn({ email, password });

      setIsRegistered(true);
    } catch (error) {
      setIsRegistered(false);
    }
  };

  if (isRegistered) return <Navigate to="/home" />;

  return(
    <>
    <h1>Login</h1>
    <form>
    <input
          data-testid="email-input"
          type="email"
          name="email"
          value={ email }
          placeholder="Digite o seu email"
          onChange={ ({ target: { value } }) => setEmail(value) }
        />
        <input
          data-testid="password-input"
          type="password"
          name="password"
          value={ password }
          placeholder="Digite a sua senha"
          onChange={ ({ target: { value } }) => setPassword(value) }
        />
        <button
          type="submit"
          onClick={ (event) => register(event) }
        >
          Entrar
        </button>
    </form>
    </>
  )
}

export default Login;
