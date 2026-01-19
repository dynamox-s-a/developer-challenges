import React, { useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { formatDate, getCategoryColor } from '@/utils/eventHelpers'
import type { Event } from '@/types/Event'

interface EventsTableProps {
    events: Event[]
    loading: boolean
    onEdit: (event: Event) => void
    onDelete: (id: number) => void
}

// Componente para exibir tabela de eventos do admin
export const EventsTable: React.FC<EventsTableProps> = ({
    events,
    loading,
    onEdit,
    onDelete,
}) => {
    const handleDescriptionPreview = useCallback((description: string): string => {
        return description.substring(0, 50) + '...'
    }, [])

    const renderEmptyState = () => (
        <TableRow>
            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="textSecondary">
                    Nenhum evento cadastrado
                </Typography>
            </TableCell>
        </TableRow>
    )

    const renderEventRow = (event: Event) => (
        <TableRow key={event.id} hover>
            <TableCell>
                <strong>{event.name}</strong>
            </TableCell>
            <TableCell>{formatDate(event.date)}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
                <Chip
                    label={event.category}
                    size="small"
                    color={getCategoryColor(event.category)}
                    variant="outlined"
                />
            </TableCell>
            <TableCell
                sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {handleDescriptionPreview(event.description)}
            </TableCell>
            <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(event)}
                            disabled={loading}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(event.id)}
                            disabled={loading}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    )

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>
                            <strong>Nome</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Data</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Local</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Categoria</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Descrição</strong>
                        </TableCell>
                        <TableCell align="center">
                            <strong>Ações</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.length === 0 ? renderEmptyState() : events.map(renderEventRow)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default EventsTable
