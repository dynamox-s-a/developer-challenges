'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import EventsTable from './events-table'
import { useState } from 'react'
import { AddEventModal } from './add-event-modal'

export default function AdminDashboard() {
  const [open, setOpen] = useState(false)

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
          <Button
            onClick={() => setOpen(true)}
            sx={{
              textWrap: 'nowrap',
              background: '#692746',
              fontSize: '12px',
              color: 'white',
              maxWidth: '180px',
            }}
          >
            Criar Evento
          </Button>

          <AddEventModal open={open} setOpen={setOpen} />

          <EventsTable />
        </Box>
      </Box>
    </Container>
  )
}
