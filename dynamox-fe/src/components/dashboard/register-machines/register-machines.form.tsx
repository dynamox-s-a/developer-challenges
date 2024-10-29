'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Stack, FormControl, InputLabel, FormHelperText, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import machinesService  from '@/services/be/machines';

const schema = zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    type: zod.string().min(1, { message: 'Type is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    name: '',
    type: '',
};

export function RegisterMachineForm(): React.JSX.Element {
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null); 

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
                await machinesService.create(values);
                setSuccessMessage('Machine registered successfully!'); 
                reset(); 
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || 'Failed to register Machine';
                    setError('root', { type: 'server', message });
                } else {
                    setError('root', { type: 'server', message: 'Failed to register Machine' });
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
                    name="type"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.type)}>
                            <InputLabel>Type</InputLabel>
                            <Select {...field} label="Type">
                                <MenuItem value="Pump">Pump</MenuItem>
                                <MenuItem value="Fan">Fan</MenuItem>
                            </Select>
                            {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
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
