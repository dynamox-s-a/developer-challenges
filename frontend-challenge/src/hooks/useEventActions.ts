import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createEvent, updateEvent, deleteEvent } from '@/store/eventsSlice'
import type { AppDispatch } from '@/store'
import type { Event } from '@/types/Event'

interface EventActionState {
    loading: boolean
    error: string
    success: string
}

// Hook para gerenciar ações de eventos (criar, atualizar, deletar)
export const useEventActions = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [state, setState] = useState<EventActionState>({
        loading: false,
        error: '',
        success: '',
    })

    const clearMessages = () => {
        setState(prev => ({ ...prev, error: '', success: '' }))
    }

    const handleCreate = async (formData: Omit<Event, 'id'>) => {
        setState(prev => ({ ...prev, loading: true, error: '', success: '' }))
        try {
            await dispatch(createEvent(formData))
            setState(prev => ({ ...prev, success: 'Evento criado com sucesso!' }))
            return true
        } catch (err: any) {
            setState(prev => ({
                ...prev,
                error: err.message || 'Erro ao criar evento',
            }))
            return false
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    const handleUpdate = async (event: Event) => {
        setState(prev => ({ ...prev, loading: true, error: '', success: '' }))
        try {
            await dispatch(updateEvent(event))
            setState(prev => ({ ...prev, success: 'Evento atualizado com sucesso!' }))
            return true
        } catch (err: any) {
            setState(prev => ({
                ...prev,
                error: err.message || 'Erro ao atualizar evento',
            }))
            return false
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    const handleDelete = async (id: number): Promise<boolean> => {
        if (!window.confirm('Tem certeza que deseja deletar este evento?')) {
            return false
        }

        setState(prev => ({ ...prev, loading: true, error: '', success: '' }))
        try {
            await dispatch(deleteEvent(id))
            setState(prev => ({ ...prev, success: 'Evento deletado com sucesso!' }))
            return true
        } catch (err: any) {
            setState(prev => ({
                ...prev,
                error: err.message || 'Erro ao deletar evento',
            })
            )
            return false
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    return {
        ...state,
        clearMessages,
        handleCreate,
        handleUpdate,
        handleDelete,
    }
}
