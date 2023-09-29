'use client'

import { useEffect } from 'react'
import { LinearProgress } from '@mui/material'
import RadarIcon from '@mui/icons-material/Radar'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import GpsFixed from '@mui/icons-material/GpsFixed'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import { getSpots } from 'redux/slices/spotsSlice'
import Loading from 'app/loading'
import { DataCard } from 'components/card/Card'

export default function Dashboard() {
  const dispatch = useAppDispatch()

  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)

  const spots = useAppSelector((state) => state.spots.spots)
  const getSpotsStatus = useAppSelector((state) => state.spots.status)
  const getSpotsError = useAppSelector((state) => state.spots.error)

  const getMonitoredMachines = () => {
    const unique = spots.reduce((acc: string[], curr) => {
      if (!acc.includes(curr.machineId)) acc.push(curr.machineId)
      return acc
    }, [])
    return unique.length > 0 ? Math.round((unique.length / machines.length) * 100) + '%' : '0'
  }

  const cardsData = [
    {
      title: 'Monitored Machines',
      amount: getMonitoredMachines(),
      caption: 'Total of machines monitored',
      icon: <RadarIcon />,
      progress: <LinearProgress value={parseFloat(getMonitoredMachines())} variant="determinate" />
    },
    {
      title: 'Machines',
      amount: machines.length,
      caption: 'Total of registered machines',
      icon: <PrecisionManufacturingIcon />,
      progress: null
    },
    {
      title: 'Spots',
      amount: spots.length,
      caption: 'Total of registered spots',
      icon: <GpsFixed />,
      progress: null
    }
  ]

  useEffect(() => {
    if (machines.length === 0) {
      dispatch(getMachines())
    }
    if (spots.length === 0) {
      dispatch(getSpots())
    }
  }, [dispatch, machines.length, spots.length])

  return (
    <>
      {getSpotsStatus === 'loading' && <Loading />}
      {getMachinesStatus === 'loading' && <Loading />}

      {getSpotsStatus === 'succeeded' &&
        getMachinesStatus === 'succeeded' &&
        cardsData.map(({ title, amount, caption, icon, progress }) => (
          <DataCard
            key={'card-' + title}
            title={title}
            amount={amount}
            caption={caption}
            icon={icon}
            progress={progress}
          />
        ))}

      {getMachinesStatus === 'failed' && getMachinesError + ' machines '}
      {getSpotsStatus === 'failed' && getSpotsError + ' spots '}
    </>
  )
}
