import { EventCard } from '@/_components/event-card'
import { urlImages } from '@/constants/event-images'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { getEvents } from '@/store/thunk/event-thunk'
import { getRandomImageUrl } from '@/utils/get-random-image'
import { Box, Skeleton, Typography } from '@mui/material'
import { useEffect } from 'react'

export function EventCardContainer() {
  const { filteredEvents, isLoading } = useAppSelector((state) => state.events)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEvents())
  }, [dispatch])

  if (filteredEvents.length === 0) {
    return (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '56px' }}>
        Desculpe, não encontramos nenhum evento.
      </div>
    )
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Typography sx={{ textAlign: 'end', fontSize: '12px', fontWeight: 600 }}>
        Encontrado ({filteredEvents.length}) Eventos
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: { xs: '24px', lg: '24px' },
          justifyContent: filteredEvents.length === 1 ? 'center' : 'start',
        }}
      >
        {isLoading ? (
          <>
            <Skeleton variant="rounded" width={'100%'} height={160} />
            <Skeleton variant="rounded" width={'100%'} height={160} />
            <Skeleton variant="rounded" width={'100%'} height={160} />
            <Skeleton variant="rounded" width={'100%'} height={160} />
            <Skeleton variant="rounded" width={'100%'} height={160} />
            <Skeleton variant="rounded" width={'100%'} height={160} />
          </>
        ) : (
          <>
            {filteredEvents.map((event) => {
              return (
                <EventCard key={event.id} data={event} randomImg={getRandomImageUrl(urlImages)} />
              )
            })}
          </>
        )}
      </Box>
    </Box>
  )
}
