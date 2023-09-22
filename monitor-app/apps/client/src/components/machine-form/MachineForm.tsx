import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { ActionsWrapper } from 'components/actions-wrapper/ActionsWrapper'
import FormStack from 'components/form-stack/FormStack'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { Machine } from 'types/machine'

export interface MachineFormProps {
  onSubmit: (data: Machine) => void
  updateData?: Machine | undefined
}

export function MachineForm({ onSubmit, updateData }: MachineFormProps) {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const {
    control,
    handleSubmit,
    formState: { errors },
    register
  } = useForm<Machine>({ defaultValues: updateData ? updateData : {} })

  const handleFormSubmit = (data: Machine) => {
    onSubmit({ ...data, id: `${id}` })
  }

  return (
    <FormStack spacing={3} component={'form'} onSubmit={handleSubmit(handleFormSubmit)}>
      <TextField
        fullWidth
        label="Machine Name"
        {...register('name', {
          required: 'Machine name is required'
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <FormControl fullWidth>
        <InputLabel>Machine Type</InputLabel>
        <Controller
          control={control}
          defaultValue=""
          name="type"
          rules={{ required: 'Please select a machine type' }}
          render={({ field }) => (
            <Select data-testid="type-select" {...field} label="Machine type" error={!!errors.type}>
              <MenuItem value={'Pump'}>Pump</MenuItem>
              <MenuItem value={'Fan'}>Fan</MenuItem>
            </Select>
          )}
        />
        <FormHelperText error={!!errors.type}>{errors.type?.message}</FormHelperText>
      </FormControl>

      <ActionsWrapper>
        <Button
          type={updateData ? 'button' : 'reset'}
          onClick={updateData && (() => router.push('/dashboard/machines'))}
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

export default MachineForm
