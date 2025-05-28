import { AppBar, Toolbar, Typography } from '@mui/material';
import { FaReact } from 'react-icons/fa';

export default function HeaderComponent() {

    return (
        <>
            <AppBar position='static'>
                <Toolbar>
                    <FaReact size={30} style={{ marginRight: 10 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                        Meu APP
                    </Typography>                    
                </Toolbar>
            </AppBar>
        </>
    )
}