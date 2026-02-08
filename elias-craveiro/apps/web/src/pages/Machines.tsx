import {
    Button,
    Container,
    Typography,
    Box,
    TextField,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    createMachineThunk,
    deleteMachineThunk,
    fetchMachinesThunk,
    updateMachineThunk,
} from '../features/machines/machinesThunks';

type MachineType = 'Pump' | 'Fan';

export default function Machines() {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((s) => s.machines);

    const [name, setName] = useState('');
    const [type, setType] = useState<MachineType>('Pump');

    // inline edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState<MachineType>('Pump');

    useEffect(() => {
        dispatch(fetchMachinesThunk());
    }, [dispatch]);

    const startEdit = (m: any) => {
        setEditingId(Number(m.id));
        setEditName(String(m.name ?? ''));
        setEditType((m.type as MachineType) ?? 'Pump');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditType('Pump');
    };

    const saveEdit = async () => {
        if (!editingId) return;
        if (!editName.trim()) return;

        await dispatch(
            updateMachineThunk({
                id: editingId,
                name: editName.trim(),
                type: editType,
            }),
        );
        cancelEdit()

    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Machines
            </Typography>

            {/* Create */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value as MachineType)}
                    sx={{ width: 160 }}
                >
                    <MenuItem value="Pump">Pump</MenuItem>
                    <MenuItem value="Fan">Fan</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={async () => {
                        if (!name.trim()) return;
                        await dispatch(
                            createMachineThunk({ name: name.trim(), type }),
                        ).unwrap();
                        setName('');
                    }}
                >
                    Add
                </Button>
            </Box>

            {/* List */}
            <List>
                {items.map((m: any) => {
                    const id = Number(m.id);
                    const isEditing = editingId === id;

                    return (
                        <ListItem
                            key={String(m.id)}
                            secondaryAction={
                                isEditing ? (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            onClick={saveEdit}
                                            disabled={!editName.trim()}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => startEdit(m)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() =>
                                                dispatch(deleteMachineThunk(id))
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                )
                            }
                        >
                            {isEditing ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        width: '80%',
                                        pr: 16,
                                    }}
                                >
                                    <TextField
                                        label="Name"
                                        value={editName}
                                        onChange={(e) =>
                                            setEditName(e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                    <TextField
                                        select
                                        label="Type"
                                        value={editType}
                                        onChange={(e) =>
                                            setEditType(
                                                e.target.value as MachineType,
                                            )
                                        }
                                        sx={{ width: 160 }}
                                        size="small"
                                    >
                                        <MenuItem value="Pump">Pump</MenuItem>
                                        <MenuItem value="Fan">Fan</MenuItem>
                                    </TextField>
                                </Box>
                            ) : (
                                <ListItemText
                                    primary={m.name}
                                    secondary={`Type: ${m.type}`}
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Container>
    );
}

