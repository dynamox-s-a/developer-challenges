import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { PointContext } from './PointContext'
import { useNavigate, useParams } from 'react-router-dom'
import { PointProps, PointWithSensors } from '../types'
import { InputErrorControlType } from '../../User/types'
import axios, { AxiosError } from 'axios'
import { MachineReduxState, PointReduxState, setPoint as setReduxPoint } from '../../../redux'
import { useDispatch, useSelector } from 'react-redux'
import { SensorProps } from '../../Sensor/types'

const initialStateInputErrorControl = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function PointContextProvider ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { id: pointId } = useParams<{ id: string }>()
  const machineId = useSelector((state: { machine: MachineReduxState }) => state.machine)?.id

  const [loading, setLoading] = useState(false)
  const [point, setPoint] = useState<PointProps>({})
  const [sensors, setSensors] = useState<SensorProps[]>([])

  const [openSnackbar, setOpenSnackbar] = useState<InputErrorControlType>(initialStateInputErrorControl)
  const [nameError, setNameError] = useState(initialStateInputErrorControl)

  const getPointById = useCallback(async () => {
    if (pointId) {
      try {
        setLoading(true)
        const resp: { data: PointWithSensors[] } = await axios.get(`http://localhost:3000/point/${pointId}`)
        const foundedPoint = resp.data[0]
        if (foundedPoint) {
          const { sensors, ...rest } = foundedPoint
          dispatch(setReduxPoint(rest))
          setPoint(rest)
          setSensors(sensors ?? [])
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
  }, [dispatch, pointId])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const formData = new FormData(e.target as HTMLFormElement)
      const name = formData.get("name")
      if (!name) return
  
      const endpoint = pointId
        ? `http://localhost:3000/point/${pointId}`
        : `http://localhost:3000/point/`
      const method = pointId ? axios.put : axios.post
      const response = await method(endpoint, { name, machine_id: machineId })
  
      const respPoint: PointReduxState = response.data.point
      if (respPoint) {
        dispatch(setReduxPoint(respPoint))

        const message = pointId ? 'Informações do Ponto atualizadas com sucesso!' : 'Ponto cadastrado com sucesso!'
        setOpenSnackbar({
          visible: true,
          message,
          type: 'success'
        })
        navigate(`/points/edit/${respPoint.id}`)
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
  }, [pointId, machineId, dispatch, navigate]) 

  const onDeletePoint = useCallback(async () => {
    await axios.delete(`http://localhost:3000/point/${pointId}`)
    setOpenSnackbar({
      visible: true,
      message: 'Ponto de Monitoramento excluído com sucesso',
      type: 'success'
    })
    navigate(`/machines/edit/${machineId}`)
  }, [machineId, navigate, pointId])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPoint({ ...point, name: value })
    if (value.trim().length > 2 ) {
      setNameError({ ...initialStateInputErrorControl, alreadyFilled: true })
    } else {
      setNameError({
        alreadyFilled: true,
        visible: true,
        message: 'Por favor, insira um nome com no mínimo 2 caracteres!'
      })
    }
  }, [point])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const onDeleteSensor = useCallback(async (sensorId: number) => {
    await axios.delete(`http://localhost:3000/sensor/${sensorId}`)
    setOpenSnackbar({
      visible: true,
      message: 'Sensor excluído com sucesso',
      type: 'success'
    })
    getPointById()
  }, [getPointById])

  const submitDisabled = useMemo(() => !nameError.alreadyFilled || nameError.visible, [nameError])

  useLayoutEffect(() => {
    if (pointId) {
      setNameError({ ...initialStateInputErrorControl, alreadyFilled: true })
      getPointById()
    } 
  }, [getPointById, pointId])

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
        onDeletePoint,
        onDeleteSensor
      }}
    >
      {children}
    </PointContext.Provider>
  )
}
