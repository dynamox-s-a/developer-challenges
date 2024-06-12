import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const n = useNavigate();
  const [data, setEP] = useState({ email: '', password: '', showPass: false });
  const { email, password, showPass } = data;
  const toggleShowPass = () => setEP({ ...data, showPass: !showPass });
  const setEmail = (value: string) => setEP({ ...data, email: value });
  const setPassword = (value: string) => setEP({ ...data, password: value });

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
          <button type="button" onClick={() => n('sign-in')}>
            Sign in
          </button>
          <button
            type="button"
            onClick={(e) => {
              setPassword('');
              bLogin(e, email, password);
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

function logInFail(error: string) {
  console.log(error);
  alert('Login Failed. Try again later.');
}

function bLogin(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  email: string,
  password: string
) {
  e.preventDefault();
  login(email, password, console.log, logInFail);
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
