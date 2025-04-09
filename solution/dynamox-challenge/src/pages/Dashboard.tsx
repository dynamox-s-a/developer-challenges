// src/pages/Dashboard.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(((state: RootState) => state.user))

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); 
    navigate('/'); 
  };

  return (
    <div>
      <h1>Bem-vindo ao Dashboard! { username }</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
