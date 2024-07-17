import { Box, Button, Grid, Typography } from '@mui/material'

import desktopAndMobile from '/assets/desktop-and-mobile.png'

const fontColor = '#263252'
const hoverButtonColor = '#38426a'

export function Home() {
    return (
        <Box display='flex' alignItems='center' justifyContent='center' flexGrow={1}>
            <Grid container maxWidth='1200px'>
                <Grid item xs={12} sm={6}
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    gap={{ xs: '12px', sm: '24px' }}
                    padding={{ xs: '12px', sm: '24px' }}
                >
                    <Typography sx={{ fontSize: { xs: '34px', sm: '48px' } }} color={fontColor}>
                        DynaPredict
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: fontColor, '&:hover': {
                                backgroundColor: hoverButtonColor
                            }
                        }}
                        href='/data'
                    >Acessar o sistema</Button>
                </Grid>
                <Grid item xs={12} sm={6} display='flex' justifyContent='center'>
                    <Box
                        component='img'
                        src={desktopAndMobile}
                        alt="Imagem contendo um notebook à esquerda e um celular à direita. Ambos os dispositivos mostram na tela uma interface contendo diferentes gráficos."
                        width={{ xs: '80%', sm: '100%' }} />
                </Grid>
            </Grid>
        </Box>
    )
}
