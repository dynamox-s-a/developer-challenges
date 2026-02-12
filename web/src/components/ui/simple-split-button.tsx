import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Grow from '@mui/material/Grow'
import { useRef, useState } from 'react'
import MachineForm from '../dashboard/forms/MachineForms'
import MonitoringPointForm from '../dashboard/forms/MonitoringPointForms'
import SensorForm from '../dashboard/forms/SensorForms'

const options = ['Create Machine', 'Create Monitoring Point', 'Create Sensor']

// 👇 Interface para as props
interface SimpleSplitButtonProps {
  onMachineCreated?: () => void
  onMonitoringPointCreated?: () => void
  onSensorCreated?: () => void
}

export default function SimpleSplitButton({
  onMachineCreated,
  onMonitoringPointCreated,
  onSensorCreated,
}: SimpleSplitButtonProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(options[0])
  const anchorRef = useRef(null)

  const [openMachine, setOpenMachine] = useState(false)
  const [openMonitoringPoint, setOpenMonitoringPoint] = useState(false)
  const [openSensor, setOpenSensor] = useState(false)

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  const handleSelect = (option: string) => {
    setSelected(option)
    setOpen(false)

    switch (option) {
      case 'Create Machine':
        setOpenMachine(true)
        break
      case 'Create Monitoring Point':
        setOpenMonitoringPoint(true)
        break
      case 'Create Sensor':
        setOpenSensor(true)
        break
    }
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
      >
        <Button
          color="secondary"
          size="small"
          onClick={handleToggle}
        >
          ▼
        </Button>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ minWidth: 200 }}>
              <MenuList>
                {options.map(option => (
                  <MenuItem
                    key={option}
                    onClick={() => handleSelect(option)}
                    selected={option === selected}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>

      <MachineForm
        open={openMachine}
        onClose={() => {
          setOpenMachine(false)
          onMachineCreated?.()
        }}
      />
      <MonitoringPointForm
        open={openMonitoringPoint}
        onClose={() => {
          setOpenMonitoringPoint(false)
          onMonitoringPointCreated?.()
        }}
      />
      <SensorForm
        open={openSensor}
        onClose={() => {
          setOpenSensor(false)
          onSensorCreated?.()
        }}
      />
    </>
  )
}
