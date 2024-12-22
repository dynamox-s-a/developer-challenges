import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { MachineContext } from './MachineContext'
import { useNavigate, useParams } from 'react-router-dom'
import { SelectChangeEvent } from '@mui/material'
import { MachineProps } from '../types'

export function MachineContextProvider ({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { id: idMachine } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(false)
  const [machine, setMachine] = useState<MachineProps>({})
  const [points, setPoints] = useState([{ id: 1, name: 'string', linkedMachine: 1, totalSensors: 1 }])


  const [openSnackbar, setOpenSnackbar] = useState({
    visible: false,
    message: ''
  })

  const [nameError, setNameError] = useState({
    alreadyFilled: false,
    visible: false,
    message: ''
  })
  const [machineTypeError, setMachineTypeError] = useState({
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
      if (name && machine.type) {
        const message = idMachine ? 'Informações da Máquina atualizadas com sucesso!' : 'Máquina cadastrada com sucesso!'
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
  }, [machine.type, idMachine, navigate])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMachine({ ...machine, name: value })
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
  }, [machine])

  const handleMachineTypeChange = useCallback((e: SelectChangeEvent<string>) => {
    const value = e.target.value
    setMachine({ ...machine, type: value})
    setMachineTypeError({
      alreadyFilled: true,
      visible: false,
      message: ''
    })
  }, [machine])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const onEditPoint = useCallback(() => {}, [])

  const onDeletePoint = useCallback(() => {}, [])

  const submitDisabled = useMemo(() => {  
    const hasAlreadyFilledRequiredFields = !nameError.alreadyFilled || !machineTypeError.alreadyFilled
    if (hasAlreadyFilledRequiredFields) return true
    const hasErrorAtRequiredField = nameError.visible || machineTypeError.visible
    if (hasErrorAtRequiredField) return true
    return false
  }, [nameError, machineTypeError])

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
    <MachineContext.Provider
      value={{
        loading,
        machine,
        points,
        openSnackbar,
        nameError,
        machineTypeError,
        submitDisabled,
        handleCloseSnackbar,
        handleSubmit,
        handleNameChange,
        handleMachineTypeChange,
        onEditPoint,
        onDeletePoint
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}
