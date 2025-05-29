import {  Typography, Box } from '@mui/material';

export default function HomePage() {


    return (
        <Box sx={{ mt: 2.5 }}>
            <Typography variant="h4">Página Inicial</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Esta é a página inicial do sistema. Você pode navegar para outras páginas usando o menu lateral.
            </Typography>
        </Box>
    )
}