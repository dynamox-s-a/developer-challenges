import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../redux/auth/authActions'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export default function Login() {
  const { loading, userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userToken) {
      navigate('/user');
    }
  }, [userToken, navigate]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          className='form-input'
          {...register('email')}
          required
        />
      </div>
      {errors.email && <span>{errors.email.message}</span>}
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          className='form-input'
          {...register('password')}
          required
        />
      </div>
      {errors.password && <span>{errors.password.message}</span>}
      <div>
        <button 
          type='submit' 
          className='button' 
          disabled={loading}
        >Login
        </button>

      </div>
    </form>
  )
}
