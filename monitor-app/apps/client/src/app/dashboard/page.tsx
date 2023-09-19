'use client'

import { useEffect } from 'react'
import { LinearProgress } from '@mui/material'
import RadarIcon from '@mui/icons-material/Radar'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import GpsFixed from '@mui/icons-material/GpsFixed'
import { useSession } from 'next-auth/react'
import { setUser } from 'redux/slices/loginSlice'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import { getSpots } from 'redux/slices/spotsSlice'
import Loading from 'app/loading'
import { DataCard } from 'components/card/Card'

export default function Dashboard() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)

  const spots = useAppSelector((state) => state.spots.spots)
  const getSpotsStatus = useAppSelector((state) => state.spots.status)
  const getSpotsError = useAppSelector((state) => state.spots.error)

  const getMonitoredMachines = () => {
    let total = 0
    machines.map((machine) => {
      spots.find((spot) => spot.machineId === machine.id && total++)
    })
    return total > 0 ? Math.round((total / machines.length) * 100) + '%' : '0'
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
    session && dispatch(setUser(session?.user))
  }, [dispatch, session])

  useEffect(() => {
    dispatch(getMachines())
    dispatch(getSpots())
  }, [dispatch])

  return (
    <>
      {(getSpotsStatus === 'loading' || getMachinesStatus === 'loading') && <Loading />}
      {getMachinesStatus === 'failed' && getMachinesError}
      {getSpotsStatus === 'failed' && getSpotsError}
      {cardsData.map(({ title, amount, caption, icon, progress }) => (
        <DataCard
          key={'card-' + title}
          title={title}
          amount={amount}
          caption={caption}
          icon={icon}
          progress={progress}
        />
      ))}
    </>
  )
}
