import logoDynaPredict from '../../public/assets/logo-dynapredict.png'
import { Box, Link } from '@mui/material'


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
             <Link href='https://dynamox.net/' underline='none' target='_blank'>
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