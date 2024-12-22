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

const initialStateInputError: InputErrorControlType = {
  alreadyFilled: false,
  visible: false,
  message: ''
}

export function SensorContextProvider ({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [sensor, setSensor] = useState<SensorProps>({})

  const [openSnackbar, setOpenSnackbar] = useState(initialStateInputError)

  const [modelError, setModelError] = useState(initialStateInputError)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (sensor.model) {
        setOpenSnackbar({
          visible: true,
          message: 'Sensor cadastrado com sucesso!'
        })
        setTimeout(() => {
          navigate(-1)
        }, 4000)
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }, [sensor.model, navigate])

  const handleSensorModelChange = useCallback((e: SelectChangeEvent<string>) => {
    const value = e.target.value
    setSensor({ ...sensor, model: value})
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
