import { Box, Link } from '@mui/material'

import logoDynaPredict from '/assets/logo-dynapredict.png'


const backgroundColor = '#263252'

export function Navbar() {
    return (
        <Box
            component='nav'
            display='flex'
            alignItems='center'
            padding={{ xs: '12px', sm: '24px' }}
            sx={{ backgroundColor: backgroundColor }}
        >
             <Link href='/' underline='none'>
                    <Box
                        component='img'
                        src={logoDynaPredict}
                        sx={{
                            width: { xs: '140px', sm: '170px' }
                        }}
                        alt='DynaPredict - página inicial'
                    />
                </Link>
                
        </Box>
    )
}