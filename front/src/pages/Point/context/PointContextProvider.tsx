import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { PointContext } from './PointContext'
import { useNavigate, useParams } from 'react-router-dom'
import { PointProps } from '../types'

export function PointContextProvider ({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { id: idMachine } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(false)
  const [point, setPoint] = useState({})
  const [sensors, setSensors] = useState([{ id: 1, name: 'string' }])

  const [openSnackbar, setOpenSnackbar] = useState({
    visible: false,
    message: ''
  })

  const [nameError, setNameError] = useState({
    alreadyFilled: false,
    visible: false,
    message: ''
  })

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData(e.target as HTMLFormElement)
      const name = formData.get("name")
      if (name) {
        const message = idMachine ? 'Informações do Ponto atualizadas com sucesso!' : 'Ponto cadastrado com sucesso!'
        setOpenSnackbar({
          visible: true,
          message: message
        })
        setTimeout(() => {
          navigate(-1)
        }, 4000)
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }, [idMachine, navigate])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPoint({ ...point, name: value })
    if (value.trim().length > 2 ) {
      setNameError({
        alreadyFilled: true,
        visible: false,
        message: ''
      })
    } else {
      setNameError({
        alreadyFilled: true,
        visible: true,
        message: 'Por favor, insira um nome com no mínimo 2 caracteres!'
      })
    }
  }, [point])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const onDeleteSensor = useCallback(() => {}, [])

  const submitDisabled = useMemo(() => {  
    if (!nameError.alreadyFilled || nameError.visible) return true
    return false
  }, [nameError])

  useLayoutEffect(() => {
    if (idMachine) {
      setNameError({
        alreadyFilled: true,
        visible: false,
        message: ''
      })
    }
  }, [idMachine])

  return (
    <PointContext.Provider
      value={{
        loading,
        point,
        sensors,
        openSnackbar,
        nameError,
        submitDisabled,
        handleCloseSnackbar,
        handleSubmit,
        handleNameChange,
        onDeleteSensor
      }}
    >
      {children}
    </PointContext.Provider>
  )
}
