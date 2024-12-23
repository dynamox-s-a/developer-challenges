import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { LoginContext } from './LoginContext'
import { setUser } from '../../../redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validatePassword } from '../../../utils/validateFunctions'
import axios, { AxiosError } from 'axios'
import { InputErrorControlType } from '../../User/types'

const initialStateInputErrorControl = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function LoginContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState(initialStateInputErrorControl)
  const [passwordError, setPasswordError] = useState(initialStateInputErrorControl)
  const [openSnackbar, setOpenSnackbar] = useState<InputErrorControlType>(initialStateInputErrorControl)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get("email")
      const password = formData.get("password")
  
      if (!email || !password) {
        setOpenSnackbar({
          visible: true,
          message: 'Preencha todos os campos',
          type: 'error'
        })
        return
      }
  
      const response = await axios.post('http://localhost:3000/login/', { email, password })
      const { token } = response.data
      localStorage.setItem('authToken', token)
      dispatch(setUser(response.data))
  
      setOpenSnackbar({
        visible: true,
        message: 'Login realizado com sucesso!',
        type: 'success'
      })
  
      navigate('/home')
    } catch (error) {
      const err = error as AxiosError<{ error: { detail: string } }>
      setOpenSnackbar({
        visible: true,
        message: `Erro ao acessar! ${err?.response?.data?.error?.detail}`,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [dispatch, navigate]) 

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validateEmail(e.target.value.trim())
    setEmailError(response)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validatePassword(e.target.value.trim())
    setPasswordError(response)
  }

  const handleCloseSnackbar = () => setOpenSnackbar({ visible: false, message: '' })

  const submitDisabled = useMemo(() => {
    return !emailError.alreadyFilled 
    || !passwordError.alreadyFilled 
    || passwordError.visible
    || emailError.visible 
  }, [emailError, passwordError])

  return (
    <LoginContext.Provider
      value={{
        loading,
        openSnackbar,
        emailError,
        passwordError,
        submitDisabled,
        handleSubmit,
        handleEmailChange,
        handlePasswordChange,
        handleCloseSnackbar
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
