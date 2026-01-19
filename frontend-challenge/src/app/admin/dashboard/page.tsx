'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventsSlice'
import { RootState } from '@/store'
import LogoutButton from '@/components/global/LogoutButton'
import EventForm from '@/components/admin/EventForm'
import EventStats from '@/components/admin/EventStats'
import EventsTable from '@/components/admin/EventsTable'
import withAuth from '@/hocs/withAuth'
import { useEventDialog } from '@/hooks/useEventDialog'
import { useEventActions } from '@/hooks/useEventActions'
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Alert, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { AppDispatch } from '@/store'
import type { Event } from '@/types/Event'

function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>()
    const events = useSelector((state: RootState) => state.events.list)
    const { isOpen, editingEvent, handleOpen, handleClose } = useEventDialog()
    const { loading, error, success, clearMessages, handleCreate, handleUpdate, handleDelete } =
        useEventActions()

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(clearMessages, 3000)
            return () => clearTimeout(timer)
        }
    }, [success, clearMessages])

    // Envia o formulário de criação/edição
    const handleFormSubmit = async (formData: Omit<Event, 'id'>) => {
        const success = editingEvent
            ? await handleUpdate({ ...formData, id: editingEvent.id } as Event)
            : await handleCreate(formData)

        if (success) {
            handleClose()
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography variant="h5" fontWeight={600}>
                    Painel Admin - Gerenciar Eventos
                </Typography>
                <Box />
                <LogoutButton />

            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ mb: 3 }}
            >
                Criar Novo Evento
            </Button>

            <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
                </DialogTitle>
                <DialogContent >
                    <EventForm
                        onSubmit={handleFormSubmit}
                        initialData={editingEvent}
                        loading={loading}
                    />
                </DialogContent>
            </Dialog>

            <EventsTable
                events={events}
                loading={loading}
                onEdit={handleOpen}
                onDelete={handleDelete}
            />

            <EventStats events={events} />
        </Container>
    )
}

export default withAuth(AdminDashboard, 'admin')
