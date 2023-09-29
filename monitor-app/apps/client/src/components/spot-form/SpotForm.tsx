import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { ActionsWrapper } from 'components/actions-wrapper/ActionsWrapper'
import FormStack from 'components/form-stack/FormStack'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import { Spot } from 'types/spot'

export interface SpotFormProps {
  onSubmit: (data: Spot) => void
  updateData?: Spot | undefined
}

export function SpotForm({ onSubmit, updateData }: SpotFormProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue
  } = useForm<Spot>({ defaultValues: updateData ? updateData : {} })

  const handleFormSubmit = (data: Spot) => {
    onSubmit({ ...data, id: `${id}`, sensorId: `Dyp.${data.sensorId}` })
  }

  const handleMask = (value: string) => {
    return value.replace(/^(\d{2})(\d{3})(\d{4}).*/, '$1.$2.$3')
  }

  const machines = useAppSelector((state) => state.machines.machines)

  useEffect(() => {
    if (machines.length === 0) {
      dispatch(getMachines())
    }
  }, [dispatch, machines])

  return (
    <FormStack spacing={2} component={'form'} onSubmit={handleSubmit(handleFormSubmit)}>
      <TextField
        fullWidth
        label="Spot Name"
        {...register('name', {
          required: 'Spot name is required'
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <FormControl fullWidth>
        <InputLabel>Machine</InputLabel>
        <Controller
          control={control}
          defaultValue=""
          name="machineId"
          rules={{ required: 'Please select a machine' }}
          render={({ field }) => (
            <Select
              data-testid="machine-select"
              {...field}
              label="Machine"
              error={!!errors.machineId}
            >
              {machines.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name + ' - ' + machine.type}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <FormHelperText error={!!errors.machineId}>{errors.machineId?.message}</FormHelperText>
      </FormControl>

      <TextField
        fullWidth
        label="Sensor ID"
        {...register('sensorId', {
          required: 'Sensor ID is required',
          minLength: { value: 11, message: 'Sensor ID must contain 9 numbers' },
          maxLength: { value: 11, message: 'Sensor ID must contain 9 numbers' }
        })}
        error={!!errors.sensorId}
        helperText={errors.sensorId?.message}
        InputProps={{
          startAdornment: <InputAdornment position="start">Dyp.</InputAdornment>
        }}
        onChange={(event) => {
          setValue('sensorId', handleMask(event.target.value.replace(/\D/g, '')))
          clearErrors('sensorId')
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Sensor Model</InputLabel>
        <Controller
          control={control}
          defaultValue=""
          name="sensorModel"
          rules={{ required: 'Please select a sensor model' }}
          render={({ field }) => (
            <Select
              data-testid="sensor-select"
              {...field}
              label="Sensor Model"
              error={!!errors.sensorModel}
            >
              <MenuItem value={'TcAg'}>TcAg</MenuItem>
              <MenuItem value={'TcAs'}>TcAs</MenuItem>
              <MenuItem value={'HF+'}>HF+</MenuItem>
            </Select>
          )}
        />
        <FormHelperText error={!!errors.sensorModel}>{errors.sensorModel?.message}</FormHelperText>
      </FormControl>

      <ActionsWrapper>
        <Button
          type={updateData ? 'button' : 'reset'}
          onClick={updateData && (() => router.push('/dashboard/spots'))}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </ActionsWrapper>
    </FormStack>
  )
}

export default SpotForm
