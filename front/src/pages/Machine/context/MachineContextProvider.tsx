import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { MachineContext } from './MachineContext'
import { useNavigate, useParams } from 'react-router-dom'
import { SelectChangeEvent } from '@mui/material'
import { MachineReduxState, setMachine as setReduxMachine } from '../../../redux'
import { MachineProps, MachineWithPoints } from '../types'
import axios, { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { InputErrorControlType } from '../../User/types'
import { PointProps } from '../../Point/types'

const initialStateInputErrorControl = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function MachineContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { id: machineId } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(false)
  const [machine, setMachine] = useState<MachineProps>({})
  const [points, setPoints] = useState<PointProps[]>([])

  const [openSnackbar, setOpenSnackbar] = useState<InputErrorControlType>(initialStateInputErrorControl)
  const [nameError, setNameError] = useState(initialStateInputErrorControl)
  const [machineTypeError, setMachineTypeError] = useState(initialStateInputErrorControl)

  const getMachineById = useCallback(async () => {
    if (machineId) {
      try {
        setLoading(true)
        const resp: { data: MachineWithPoints[] } = await axios.get(`http://localhost:3000/machine/${machineId}`)
        const foundedMachine = resp.data[0]
        if (foundedMachine) {
          const { points, ...rest } = foundedMachine
          dispatch(setReduxMachine(rest))
          setMachine(rest)
          setPoints(points)
        }
      } catch (error) {
        const err = error as AxiosError<{ error: { detail: string } }>
        setOpenSnackbar({
          visible: true,
          message: `Erro! ${err?.response?.data?.error?.detail}`,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  }, [dispatch, machineId])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const formData = new FormData(e.target as HTMLFormElement)
      const name = formData.get("name")
      if (!name || !machine.type) return
  
      const endpoint = machineId
        ? `http://localhost:3000/machine/${machineId}`
        : `http://localhost:3000/machine/`
      const method = machineId ? axios.put : axios.post
      const response = await method(endpoint, { name, type: machine.type })
  
      const respMachine: MachineReduxState = response.data.machine
      if (respMachine) {
        dispatch(setReduxMachine(respMachine))

        const message = machineId ? 'Informações da Máquina atualizadas com sucesso!' : 'Máquina cadastrada com sucesso!'
        setOpenSnackbar({
          visible: true,
          message,
          type: 'success'
        })
        navigate(`/machines/edit/${respMachine.id}`)
      }
    } catch (error) {
      const err = error as AxiosError<{ error: { detail: string } }>
      setOpenSnackbar({
        visible: true,
        message: `Erro! ${err?.response?.data?.error?.detail}`,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [dispatch, machineId, machine.type, navigate]) 

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMachine({ ...machine, name: value })
    if (value.trim().length > 2 ) {
      setNameError({ ...initialStateInputErrorControl, alreadyFilled: true })
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
    setMachineTypeError({ ...initialStateInputErrorControl, alreadyFilled: true })
  }, [machine])

  const onDeleteMachine = useCallback(async () => {
    await axios.delete(`http://localhost:3000/machine/${machineId}`)
    setOpenSnackbar({
      visible: true,
      message: 'Máquina excluída com sucesso',
      type: 'success'
    })
    navigate(`/home`)
  }, [machineId, navigate])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const onEditPoint = useCallback((pointId: number) => navigate(`/points/edit/${pointId}`), [navigate])

  const onDeletePoint = useCallback(async (pointId: number) => {
    await axios.delete(`http://localhost:3000/point/${pointId}`)
    setOpenSnackbar({
      visible: true,
      message: 'Ponto excluído com sucesso',
      type: 'success'
    })
    getMachineById()
  }, [getMachineById])

  const submitDisabled = useMemo(() => {
    return !nameError.alreadyFilled 
    || !machineTypeError.alreadyFilled 
    || nameError.visible 
    || machineTypeError.visible
  }, [nameError, machineTypeError])

  useLayoutEffect(() => {
    if (machineId) {
      setNameError({ ...initialStateInputErrorControl, alreadyFilled: true })
      setMachineTypeError({ ...initialStateInputErrorControl, alreadyFilled: true })
      getMachineById()
    }
  }, [getMachineById, machineId])

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
        onDeleteMachine,
        onEditPoint,
        onDeletePoint
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}
