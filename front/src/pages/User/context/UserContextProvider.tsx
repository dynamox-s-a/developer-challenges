import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { UserContext } from './UserContext'
import { setUser, UserReduxState } from '../../../redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validatePassword } from '../../../utils/validateFunctions'

export function UserContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state: { user: UserReduxState }) => state.user)

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState({
    visible: false,
    message: ''
  })

  const [emailError, setEmailError] = useState({
    alreadyFilled: false,
    visible: false,
    message: ''
  })
  const [passwordError, setPasswordError] = useState({
    alreadyFilled: false,
    visible: false,
    message: ''
  })

  const [confirmPasswordError, setConfirmPasswordError] = useState({
    alreadyFilled: false,
    visible: false,
    message: ''
  })

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get("email")
      const password = formData.get("password")
      console.log("E-mail:", email)
      console.log("Senha:", password)
      if (email && password) {
        const userData = {
          id: 1,
          name: 'John Doe',
          email: String(email)
        }
        dispatch(setUser(userData))
        const message = user?.id ? 'Informações de Usuário atualizadas com sucesso!' : 'Usuário cadastrado com sucesso!'
        setOpenSnackbar({
          visible: true,
          message: message
        })
        if (!user?.id) {
          setTimeout(() => {
            navigate("/login")
          }, 4000)
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }, [dispatch, navigate, user?.id])

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
      setConfirmPasswordError({
        alreadyFilled: true,
        visible: false,
        message: ''
      })
    }
  }, [password])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const submitDisabled = useMemo(() => {  
    const hasAlreadyFilledRequiredFields = !emailError.alreadyFilled || !passwordError.alreadyFilled || !confirmPasswordError.alreadyFilled
    if (hasAlreadyFilledRequiredFields) return true
    const hasErrorAtRequiredField = emailError.visible || passwordError.visible || confirmPasswordError.visible
    if (hasErrorAtRequiredField) return true
    return false
  }, [confirmPasswordError, emailError, passwordError])

  useLayoutEffect(() => {
    if (user?.id && user?.email) {
      setEmailError({
        alreadyFilled: true,
        visible: false,
        message: ''
      })
    }
  }, [user?.email, user?.id])

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
