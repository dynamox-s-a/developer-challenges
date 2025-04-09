// src/routes/PrivateRoute.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate } from 'react-router-dom';
import { JSX } from '@emotion/react/jsx-runtime';

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  return isLoggedIn ? children : <Navigate to="/" replace />;
}
