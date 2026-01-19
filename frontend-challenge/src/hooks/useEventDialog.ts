import { useState } from 'react'
import type { Event } from '@/types/Event'

// Hook para gerenciar estado do diálogo de criação/edição de eventos
export const useEventDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | undefined>()

    const handleOpen = (event?: Event) => {
        setEditingEvent(event)
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        setEditingEvent(undefined)
    }

    return {
        isOpen,
        editingEvent,
        handleOpen,
        handleClose,
    }
}
