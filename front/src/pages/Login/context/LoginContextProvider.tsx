import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { LoginContext } from './LoginContext'
import { setUser } from '../../../redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validatePassword } from '../../../utils/validateFunctions'

export function LoginContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
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
        navigate("/home")
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }, [dispatch, navigate])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validateEmail(e.target.value.trim())
    setEmailError(response)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const response = validatePassword(e.target.value.trim())
    setPasswordError(response)
  }, [])

  const submitDisabled = useMemo(() => {  
    if (!emailError.alreadyFilled || !passwordError.alreadyFilled) return true  
    if (emailError.visible || passwordError.visible) return true
    return false
  }, [emailError.alreadyFilled, emailError.visible, passwordError.alreadyFilled, passwordError.visible])

  return (
    <LoginContext.Provider
      value={{
        loading,
        emailError,
        passwordError,
        submitDisabled,
        handleSubmit,
        handleEmailChange,
        handlePasswordChange
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
