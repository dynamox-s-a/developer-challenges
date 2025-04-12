import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/actions';
import { AppDispatch } from '../redux/store';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector((state: RootState) => state.error);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn); 
  const userId = useSelector((state: RootState) => state.id);

  useEffect(() => {
    if (isLoggedIn && userId !== null) {
      navigate('/dashboard'); 
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      dispatch(loginUser(email, password));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>Entrar</button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </form>
  );
}
