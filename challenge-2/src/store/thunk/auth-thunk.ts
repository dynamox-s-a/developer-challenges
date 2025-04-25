// store/auth/thunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  loginUserFailure,
  loginUserRequest,
  loginUserSuccess,
  logoutUserFailure,
  logoutUserRequest,
  logoutUserSuccess,
} from '../actions/auth-actions'

export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(loginUserRequest())

    try {
      const response = await axios.get(`http://localhost:3333/users?email=${username}`)
      const users = response.data

      if (users.length === 0) {
        throw new Error('Usuário não encontrado')
      }

      const user = users[0]

      if (user.password !== password) {
        throw new Error('Senha incorreta')
      }

      const fakeToken = `fake-jwt-token.${btoa(
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
        })
      )}`

      localStorage.setItem('token', fakeToken)
      localStorage.setItem('role', user.role)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
        })
      )

      dispatch(
        loginUserSuccess({
          token: fakeToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        })
      )

      return { token: fakeToken, user }
    } catch (error) {
      const errorMessage =
        error.message || 'Erro ao tentar fazer login. Verifique suas credenciais.'
      dispatch(loginUserFailure(errorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
  dispatch(logoutUserRequest())

  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(logoutUserSuccess())
    return true
  } catch (error) {
    const errorMessage = 'Erro ao tentar fazer logout.'
    dispatch(logoutUserFailure(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

export const loadUserFromStorage = createAsyncThunk('auth/loadUser', async (_, { dispatch }) => {
  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')

  if (token && userString) {
    try {
      const user = JSON.parse(userString)
      dispatch(
        loginUserSuccess({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        })
      )
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
