import { Box, Link, Typography } from '@mui/material'

import logoDynamox from '../../public/assets/logo-dynamox.png'


const fontColor = '#fff'
const backgroundColor = '#263252'


export function Footer() {
    return (
        <Box
            component='footer'
            display='flex'
            justifyContent='center'
            alignItems='center'
            padding={{ xs: '12px', sm: '24px' }}
            color={fontColor}
            sx={{ backgroundColor: backgroundColor }}
        >
            <Box
                component='span'
                display='flex'
                alignItems='center'
                gap={{ xs: '5px', sm: '10px' }}
            >
                <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                    Desenvolvido por
                </Typography>
                <Link href='https://dynamox.net/' underline='none' target='_blank'>
                    <Box
                        component='img'
                        src={logoDynamox}
                        sx={{
                            width: { xs: '60px', sm: '80px' }
                        }}
                        alt='Dynamox - site oficial'
                    />
                </Link>
            </Box>
        </Box>
    )
}
