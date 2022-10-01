import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistered, setIsRegistered] = useState(false)

  const initialState = {
    user: {
      emailDefault: 'teste@teste.com',
      senhaDefault: 'senhateste',
    }
  }

  useEffect(() => {

  }, [email, senha, isRegistered])

  const register = () => {
    try {
      if(email === initialState.user.emailDefault && senha === initialState.user.senhaDefault) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
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
          value={ senha }
          placeholder="Digite a sua senha"
          onChange={ ({ target: { value } }) => setSenha(value) }
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
