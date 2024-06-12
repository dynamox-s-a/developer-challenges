import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const n = useNavigate();
  const [{ email, password }, setEP] = useState({ email: '', password: '' });
  return (
    <div id="login">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <span>Email: </span>
          <input
            type="email"
            onChange={({ target: { value } }) => {
              setEP({ email: value, password });
            }}
          />
        </div>
        <div>
          <span>Password: </span>
          <input
            type="password"
            onChange={({ target: { value } }) => {
              setEP({ email, password: value });
            }}
          />
        </div>
        <div id="controls">
          <button type="button" onClick={() => n('sign-in')}>
            Sign in
          </button>
          <button type="button" onClick={(e) => bLogin(e, email, password)}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

function bLogin(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  email: string,
  password: string
) {
  e.preventDefault();
  login(email, password);
}

function login(email: string, password: string) {
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
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
