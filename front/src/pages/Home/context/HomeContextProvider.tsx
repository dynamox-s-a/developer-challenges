import { ReactNode, useCallback, useState } from 'react'
import { HomeContext } from './HomeContext'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function HomeContextProvider ({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const redux = useSelector((state) => state)
  console.log("🚀 ~ HomeContextProvider ~ redux:", redux)

  const [loading, setLoading] = useState(false)
  const [machines, setMachines] = useState([{ id: 1, name: 'string', type: 'Pump', totalPoints: 1, totalSensors: 1 }])
  const [points, setPoints] = useState([{ id: 1, name: 'string', linkedMachine: 1, totalSensors: 1 }])

  const onEditMachine = useCallback((machineId?: number) => {
    navigate(`/machines/edit/${machineId}`)
  }, [navigate])

  const onDeleteMachine = useCallback((machineId?: number) => {
  console.log("🚀 ~ onDelete ~ idMachine:", machineId)
  }, [])

  const onEditPoint = useCallback((pointId?: number) => {
    navigate(`/points/edit/${pointId}`)
  }, [navigate])

  const onDeletePoint = useCallback((pointId?: number) => {
  console.log("🚀 ~ onDelete ~ idMachine:", pointId)
  }, [])

  return (
    <HomeContext.Provider
      value={{
        machines,
        points,
        loading,
        onEditMachine,
        onDeleteMachine,
        onEditPoint,
        onDeletePoint
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
