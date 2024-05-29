import { Box, Typography, Button } from "@mui/material";

export function HeroVideoSection(){
  return (
    <>
      <Box sx={{ position: {md: 'relative'}, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr'}, flexDirection: { xs: 'column', md: 'row' }, falignItems: 'center', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', width: { md: '500px'} }}>
          <Typography sx={{ fontSize: '2rem', color: '#692742' }} variant="h3">Your partner in monitoring the health and performance of assets</Typography>
          <Button sx={{ padding: '12px' , width: { md: '280px'}}} variant="contained">Talk to speacialist</Button>
          <Box></Box>
        </Box> 
      </Box>
      <Box sx={{ zIndex: '-1', position:{ md: 'absolute' }, top: '50px', left: '300px', display: { xs: 'none', md: 'block'} }}>
        <video 
          src={'https://storage.googleapis.com/ccorp-public-assets/Institutional/Home/final-hero-video_en-US.webm'}
          autoPlay
          loop
          muted
          style={{ maxWidth: '1200px', maxHeight: '100%', width: 'auto', height: 'auto' }}
        />
      </Box>
    </>
  )
}