import { Button } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/auth/authSlice'

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
    navigate("/");
  };

  return (
    <nav>
      <div className="navbar-brand">
        <Link to='/user'>Lista</Link>
        <Link to='/user/addProduct'>Adicionar produto</Link>
        <Link to='/user/editProduct'>Editar produto</Link>
      </div>
      <div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  )
}
