'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import EventsTable from './events-table'
import { useState } from 'react'
import { EventModal } from './event-modal'
import { useAppSelector } from '@/store/store'

export default function AdminDashboard() {
  const { events } = useAppSelector((state) => state.events)
  const [open, setOpen] = useState(false)

  const hasEvents = events.length > 0

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        marginTop: { xs: '40px', lg: '80px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <Typography variant="h3">Eventos</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'end',
            justifyContent: 'end',
          }}
        >
          {hasEvents && (
            <Button
              onClick={() => setOpen(true)}
              sx={{
                textWrap: 'nowrap',
                background: '#692746',
                fontSize: '14px',
                color: 'white',
                maxWidth: '180px',
                textTransform: 'none',
              }}
            >
              Criar Evento
            </Button>
          )}

          <EventModal open={open} setOpen={setOpen} mode="create" />

          <EventsTable />

          <Box
            sx={{
              display: 'flexs',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {!hasEvents && (
              <Button
                onClick={() => setOpen(true)}
                sx={{
                  textWrap: 'nowrap',
                  background: '#692746',
                  fontSize: '18px',
                  color: 'white',
                  width: '300px',
                  fontWeight: '400',
                  textTransform: 'none',
                }}
              >
                Criar evento
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
