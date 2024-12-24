import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { UserContext } from './UserContext'
import { setUser, UserReduxState } from '../../../redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from "axios"
import { validateEmail, validatePassword } from '../../../utils/validateFunctions'
import { InputErrorControlType } from '../types'

const initialStateInputErrorControl = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function UserContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state: { user: UserReduxState }) => state.user)
  const { id: userId, email: userEmail } = user

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState<InputErrorControlType>(initialStateInputErrorControl)
  const [emailError, setEmailError] = useState(initialStateInputErrorControl)
  const [passwordError, setPasswordError] = useState(initialStateInputErrorControl)
  const [confirmPasswordError, setConfirmPasswordError] = useState(initialStateInputErrorControl)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get("email")
      const password = formData.get("password")
  
      if (!email || !password) return
  
      const endpoint = userId
        ? `http://localhost:3000/user/${userId}`
        : `http://localhost:3000/user/`
      const method = userId ? axios.put : axios.post
      const response = await method(endpoint, { email, password })
  
      if (response) {
        dispatch(setUser({ id: userId, email: String(email) }))

        const message = userId ? 'Informações do Usuário alteradas com sucesso!' : 'Usuário cadastrado com sucesso!'
        setOpenSnackbar({
          visible: true,
          message,
          type: 'success'
        })
        if (!userId) setTimeout(() => navigate("/login"), 4000)
      }
    } catch (error) {
      const err = error as AxiosError<{ error: { detail: string } }>
      setOpenSnackbar({
        visible: true,
        message: `Erro ao cadastrar usuário! ${err?.response?.data?.error?.detail}`,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [dispatch, navigate, userId]) 

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validateEmail(e.target.value.trim())
    setEmailError(response)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validatePassword(e.target.value.trim())
    setPassword(e.target.value)
    setPasswordError(response)
  }, [])

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value !== password) {
      setConfirmPasswordError({
        alreadyFilled: true,
        visible: true,
        message: 'Sua senha e a confirmação não são iguais!'
      })
    } else {
      setConfirmPasswordError({ ...initialStateInputErrorControl, alreadyFilled: true })
    }
  }, [password])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const submitDisabled = useMemo(() => {  
    return !confirmPasswordError.alreadyFilled 
    || !passwordError.alreadyFilled 
    || confirmPasswordError.visible
    || !emailError.alreadyFilled
    || passwordError.visible 
    || emailError.visible 
  }, [confirmPasswordError, emailError, passwordError])

  useLayoutEffect(() => {
    if (userId && userEmail) setEmailError({ ...initialStateInputErrorControl, alreadyFilled: true })
  }, [userEmail, userId])

  return (
    <UserContext.Provider
      value={{
        loading,
        openSnackbar,
        emailError,
        passwordError,
        confirmPasswordError,
        submitDisabled,
        handleCloseSnackbar,
        handleSubmit,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
