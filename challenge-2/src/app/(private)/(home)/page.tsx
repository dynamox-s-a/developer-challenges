'use client'

import { Box, Container, Typography } from '@mui/material'
import { EventCardContainer } from './components/event-card-container'
import { EventFilters } from './components/event-filters'

export default function Home() {
  return (
    <div>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          my: { xs: '40px', lg: '80px' },
        }}
      >
        <Typography variant="h3">Eventos Dynamox</Typography>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'start', alignItems: 'center' }}>
          <EventFilters />
        </Box>

        <EventCardContainer />
      </Container>
    </div>
  )
}
