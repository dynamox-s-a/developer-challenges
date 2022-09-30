import React, { useState, useEffect } from 'react';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (event) => {
    event.preventDefault();

    // try {
    //   const result = await signIn('/login', user);



    //   setIsRegistered(true);
    // } catch (error) {
    //   setFailedTryRegister(true);
    //   setIsRegistered(false);
    // }
  };

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
          disabled={ this.handleDisabled() }
          onClick={ (event) => register(event) }
        >
          Entrar
        </button>
    </form>
    </>
  )
}

export default Home;
