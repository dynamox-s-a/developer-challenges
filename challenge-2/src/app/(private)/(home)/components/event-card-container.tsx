import { EventCard } from '@/_components/event-card'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { getEvents } from '@/store/thunk/event-thunk'
import { getRandomImageUrl } from '@/utils/get-random-image'
import { Box, Skeleton } from '@mui/material'
import { useEffect } from 'react'

const urlImages = [
  'https://i0.wp.com/storage.googleapis.com/dyx-communications-mkt-public-assets/Blog/Imagens/maquina_de_papel02.jpeg?w=750&ssl=1',
  'https://i0.wp.com/content.dynamox.net/wp-content/uploads/2024/11/Case-de-Sucesso-Cal-Trevo-imagens-1-scaled.jpg?w=2250&ssl=1',
  'https://dynamox.net/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fccorp-public-assets%2FInstitutional%2FSuccessHistory%2FFS%2Fgeneral.webp&w=3840&q=75',
]

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
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: { xs: '24px', lg: '16px' },
          mt: '40px',
          mb: '40px',
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
    </>
  )
}
