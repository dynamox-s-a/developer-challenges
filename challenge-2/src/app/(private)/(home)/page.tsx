'use client'

import { Container, Typography } from '@mui/material'
import { EventCardContainer } from './components/event-card-container'

export default function Home() {
  return (
    <div>
      <Container sx={{ marginTop: { xs: '40px', lg: '80px' } }}>
        <Typography variant="h3">Eventos Dynamox</Typography>
        <EventCardContainer />
      </Container>
    </div>
  )
}
