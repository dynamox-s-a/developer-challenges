import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { Button } from '@mui/material';

export default function Login() {
  const auth = useAuth();
  const n = useNavigate();
  const { state } = useLocation();
  const [data, setEP] = useState({ email: '', password: '', showPass: false });
  const { email, password, showPass } = data;
  const toggleShowPass = () => setEP({ ...data, showPass: !showPass });
  const setEmail = (value: string) => setEP({ ...data, email: value });
  const setPassword = (value: string) => setEP({ ...data, password: value });

  const loginFail = (error: string) => {
    console.log('Login failed: ', error);
    setPassword('');
    alert('Login Failed. Try again later.');
  };

  const loginSuccess = (loginData: string) => {
    console.log('Login success: ', loginData);
    const user = JSON.parse(loginData);
    auth!.login(user).then(() => n(state?.path || '/machines'));
  };

  const handleSign = () => n('/sign-in');

  const handleLogin = () => {
    login(email, password, loginSuccess, loginFail);
  };

  return (
    <div id="login">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <span>Email: </span>
          <input
            type="email"
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div>
          <span>
            Password:{' '}
            <button type="button" onClick={() => toggleShowPass()}>{`${
              showPass ? '🔓' : '🔒'
            }`}</button>
          </span>
          <input
            value={password}
            type={showPass ? 'text' : 'password'}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>
        <div id="controls">
          <Button onClick={handleSign} variant="contained" children="Sign in" />
          <Button onClick={handleLogin} variant="contained" children="Login" />
        </div>
      </form>
    </div>
  );
}

function login(
  email: string,
  password: string,
  okFunc = console.log,
  errFunc = console.log
) {
  const data = JSON.stringify({
    email,
    password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      okFunc(JSON.stringify(response.data));
    })
    .catch((error) => {
      errFunc(error);
    });
}
