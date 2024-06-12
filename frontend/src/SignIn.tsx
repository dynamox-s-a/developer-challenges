import axios from 'axios';
import validator from 'validator';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function SignIn() {
  const n = useNavigate();
  const [{ name, email, password, pass }, setEP] = useState({
    name: '',
    email: '',
    password: '',
    pass: '',
  });
  const [showPass, setShowPass] = useState(false);
  return (
    <div id="login">
      <h2>Register New User</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <span>Name: </span>
          <input
            type="text"
            className={name.length && name.length < 3 ? 'text-danger' : ''}
            onChange={({ target: { value } }) => {
              setEP({ name: value, email, password, pass });
            }}
          />
        </div>
        <div>
          <span>Email: </span>
          <input
            type="email"
            className={
              email.length && !validator.isEmail(email) ? 'text-danger' : ''
            }
            onChange={({ target: { value } }) => {
              setEP({ name, email: value, password, pass });
            }}
          />
        </div>
        <div>
          <span>
            Password:{' '}
            <button
              type="button"
              onClick={() => {
                setShowPass(!showPass);
              }}
            >{`${showPass ? '🔓' : '🔒'}`}</button>
          </span>
          <input
            type={showPass ? 'text' : 'password'}
            onChange={({ target: { value } }) => {
              setEP({ name, email, password: value, pass });
            }}
          />
        </div>

        <div>
          <span>Confirm password: </span>
          <input
            type={showPass ? 'text' : 'password'}
            className={pass.length && pass != password ? 'text-danger' : ''}
            onChange={({ target: { value } }) => {
              setEP({ name, email, password, pass: value });
            }}
          />
        </div>
        <div id="controls">
          <button type="button" onClick={() => n('../')}>
            {'< Back'}
          </button>
          <button
            type="button"
            disabled={
              name.length < 3 ||
              !validator.isEmail(email) ||
              password.length < 8 ||
              pass != password
            }
            onClick={(e) => bSignIn(e, name, email, password)}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

function bSignIn(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  name: string,
  email: string,
  password: string
) {
  e.preventDefault();
  signin(name, email, password);
}

function signin(name: string, email: string, password: string) {
  const data = JSON.stringify({
    name,
    email,
    password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/users',
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
