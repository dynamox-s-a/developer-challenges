'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import monitoringPointsService from '@/services/be/monitoring-points';
import { Stack, FormControl, InputLabel, FormHelperText, Button, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { getAll as getAllMachines } from '@/store/reducers/machines.reducers';
import { getAll as getAllSensors } from '@/store/reducers/sensors.reducer';
import { RootState } from '@/store/rootReducer';
import { Machines } from '@/store/reducers/machines.reducers';
import { Sensors } from '@/store/reducers/sensors.reducer';
import axios, { AxiosError } from 'axios';

const schema = zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    sensorUUID: zod.string().min(1, { message: 'sensor is required' }),
    machineUUID: zod.string().min(1, { message: 'machine is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    name: '',
    sensorUUID: '',
    machineUUID: ''
};

export function RegisterMonitoringPointsForm(): React.JSX.Element {
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

    const { machines } = useSelector((state: RootState) => state.machinesReducer);
    const { sensors } = useSelector((state: RootState) => state.sensorsReducer);

    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        dispatch(getAllMachines());
        dispatch(getAllSensors());
    }, [dispatch]);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            try {
                await monitoringPointsService.create(values);
                setSuccessMessage('Monitoring Point registered successfully!');
                reset();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || 'Failed to register Monitoring Point';
                    setError('root', { type: 'server', message });
                } else {
                    setError('root', { type: 'server', message: 'Failed to register Monitoring Point' });
                }
            } finally {
                setIsPending(false);
            }
        },
        [reset, setError]
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <Stack spacing={2}>
                {successMessage && (
                    <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                        {successMessage}
                    </Alert>
                )}
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.name)} >
                            <InputLabel>Name </InputLabel>
                            < OutlinedInput {...field} label="Name" type="name" />
                            {errors.name && <FormHelperText>{errors.name.message} </FormHelperText>}
                        </FormControl>
                    )
                    }
                />
                <Controller
                    control={control}
                    name="machineUUID"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.machineUUID)}>
                            <InputLabel>Machine</InputLabel>
                            <Select {...field} label="machineUUID">
                                {machines.map((machine: Machines) => (
                                    <MenuItem key={machine.uuid} value={machine.uuid}>
                                        {machine.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.machineUUID && <FormHelperText>{errors.machineUUID.message}</FormHelperText>}
                        </FormControl>
                    )}
                />
                <Controller
                    control={control}
                    name="sensorUUID"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.sensorUUID)}>
                            <InputLabel>Sensor</InputLabel>
                            <Select {...field} label="sensorUUID">
                                {sensors.map((sensor: Sensors) => (
                                    <MenuItem key={sensor.uuid} value={sensor.uuid}>
                                        {sensor.modelName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.sensorUUID && <FormHelperText>{errors.sensorUUID.message}</FormHelperText>}
                        </FormControl>
                    )}
                />
                {errors.root && <Alert color="error" > {errors.root.message} </Alert>}
                <Button disabled={isPending} type="submit" variant="contained" >
                    Register Machine
                </Button>
            </Stack>
        </form>
    )
}
