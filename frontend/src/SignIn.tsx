import axios from 'axios';
import validator from 'validator';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function SignIn() {
  const n = useNavigate();
  const [data, setEP] = useState({
    name: '',
    email: '',
    password: '',
    pass: '',
    showPass: false,
  });

  const { name, email, password, pass, showPass } = data;
  const toggleShowPass = () => setEP({ ...data, showPass: !showPass });
  const setName = (value: string) => setEP({ ...data, name: value });
  const setEmail = (value: string) => setEP({ ...data, email: value });
  const setPass = (value: string) => setEP({ ...data, pass: value });
  const setPassword = (value: string) => setEP({ ...data, password: value });
  const classForName = name.length && name.length < 3 ? 'text-danger' : '';
  const classForEmail =
    email.length && !validator.isEmail(email) ? 'text-danger' : '';
  const disableSign =
    name.length < 3 ||
    !validator.isEmail(email) ||
    password.length < 8 ||
    pass !== password;

  const signInFail = (error: string) => {
    console.log("Sign in failed: ", error);
    alert('Sign in Failed. Try again later.');
  };

  const signInSuccess = (loginData: string) => {
    console.log("Sign in success: ", loginData);
    n('/machines');
  };

  return (
    <div id="login">
      <h2>Register New User</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <span>Name: </span>
          <input
            type="text"
            className={classForName}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        <div>
          <span>Email: </span>
          <input
            type="email"
            className={classForEmail}
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
            type={showPass ? 'text' : 'password'}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>

        <div>
          <span>Confirm password: </span>
          <input
            type={showPass ? 'text' : 'password'}
            className={pass.length && pass != password ? 'text-danger' : ''}
            onChange={({ target: { value } }) => setPass(value)}
          />
        </div>
        <div id="controls">
          <button type="button" onClick={() => n('../')}>
            {'< Back'}
          </button>
          <button
            type="button"
            disabled={disableSign}
            onClick={(e) => {
              e.preventDefault();
              signin(name, email, password, signInSuccess, signInFail);
            }}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

function signin(
  name: string,
  email: string,
  password: string,
  okFunc = console.log,
  errFunc = console.log
) {
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
      okFunc(JSON.stringify(response.data));
    })
    .catch((error) => {
      errFunc(error);
    });
}
