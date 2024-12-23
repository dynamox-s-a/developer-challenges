import React, { 
  ReactNode, 
  useCallback,
  useMemo, 
  useState 
} from 'react'
import { SensorContext } from './SensorContext'
import { useNavigate } from 'react-router-dom'
import { SelectChangeEvent } from '@mui/material'
import { InputErrorControlType } from '../../User/types'
import { SensorProps } from '../types'
import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { PointReduxState } from '../../../redux'

const initialStateInputError: InputErrorControlType = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function SensorContextProvider ({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const pointId = useSelector((state: { point: PointReduxState }) => state.point)?.id

  const [loading, setLoading] = useState(false)
  const [sensor, setSensor] = useState<SensorProps>({})

  const [openSnackbar, setOpenSnackbar] = useState(initialStateInputError)

  const [modelError, setModelError] = useState(initialStateInputError)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!sensor.type) return
  
      await axios.post(`http://localhost:3000/sensor/`, { type: sensor.type, point_id: pointId })
      setOpenSnackbar({
        visible: true,
        message: 'Sensor cadastrado com sucesso!',
        type: 'success'
      })
      setTimeout(() => {
        navigate(`/points/edit/${pointId}`)
      }, 2500)
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
  }, [sensor.type, pointId, navigate]) 

  const handleSensorModelChange = useCallback((e: SelectChangeEvent<string>) => {
    const value = e.target.value
    setSensor({ ...sensor, type: value})
    setModelError({ ...initialStateInputError, alreadyFilled: true })
  }, [sensor])

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar({ visible: false, message: '' }), [])

  const submitDisabled = useMemo(() => !modelError.alreadyFilled || modelError.visible ? true : false, [modelError])

  return (
    <SensorContext.Provider
      value={{
        loading,
        sensor,
        openSnackbar,
        modelError,
        submitDisabled,
        handleCloseSnackbar,
        handleSubmit,
        handleSensorModelChange
      }}
    >
      {children}
    </SensorContext.Provider>
  )
}
