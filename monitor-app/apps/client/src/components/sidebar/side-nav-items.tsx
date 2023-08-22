import BarChartIcon from '@mui/icons-material/BarChart'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import GpsFixed from '@mui/icons-material/GpsFixed'

export const sideNavItems = [
  {
    text: 'Dashboard',
    link: '/dashboard',
    icon: <BarChartIcon />
  },
  {
    text: 'Machines',
    link: '/dashboard/machines',
    icon: <PrecisionManufacturingIcon />
  },
  {
    text: 'Spots',
    link: '/dashboard/spots',
    icon: <GpsFixed />
  }
]
