import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function HomePage() {

    const handleClick = async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
        alert(JSON.stringify(response.data));
    };
    
    return (
        <Box sx={{ mt: 2.5 }}>
            <Typography variant="h4">Página Inicial</Typography>
            <Button variant="contained" color="primary" onClick={handleClick} sx={{ mt: 2 }}>
                Fazer requisição com Axios
            </Button>
        </Box>
    )
}