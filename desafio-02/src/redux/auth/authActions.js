
import { createAsyncThunk } from '@reduxjs/toolkit'
import { findUser } from '../../services/requests'

export const userLogin = createAsyncThunk(
  'user/login',
  async (userInfo, { rejectWithValue }) => {
    try {
      const checkUser = await findUser(userInfo.email)
      if (checkUser === null) {
        return rejectWithValue("Usuário não cadastrado");
      }
      if (checkUser.password !== userInfo.password) {
        return rejectWithValue("Senha incorreta");
      }
      // const jwtToken = jwt.sign(userInfo.email, "secret", { expiresIn: '7d', algorithm: 'HS256' })
      localStorage.setItem('token', 'jwtTokenFake')

      return checkUser;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)
