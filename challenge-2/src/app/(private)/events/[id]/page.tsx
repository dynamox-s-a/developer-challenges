'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { getEventsById } from '@/store/thunk/event-thunk'
import Image from 'next/image'
import { urlImages } from '@/constants/event-images'
import { getRandomImageUrl } from '@/utils/get-random-image'
import { formatDate } from '@/utils/format-date'

export default function EventPage() {
  const { selectedEvent } = useAppSelector((state) => state.events)
  const dispatch = useAppDispatch()
  const params = useParams()
  const eventId = params?.id as string

  useEffect(() => {
    dispatch(getEventsById(eventId))
  }, [eventId, dispatch])

  if (!selectedEvent) {
    return <Container sx={{ my: '40px' }}>Nenhum evento selecionado</Container>
  }

  return (
    <Container sx={{ mb: '40px', overflow: 'hidden' }}>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '20 / 9', // Mais panorâmico
          // aspectRatio: '16 / 9', // MAis quadrado
          position: 'relative',
        }}
      >
        <Image src={getRandomImageUrl(urlImages)} alt="Imagem" fill className="object-cover" />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 600, mt: '32px' }}>
        {selectedEvent.event_name}
      </Typography>
      <Box sx={{ color: '#692746' }}>{formatDate(selectedEvent.date_time)}</Box>

      <Typography sx={{ mt: '16px', width: '600px' }}>{selectedEvent.description}</Typography>
    </Container>
  )
}
