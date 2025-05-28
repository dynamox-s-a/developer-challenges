import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';



export default function HomePage() {

    const StyledDiv = styled.div`  margin-top: 20px;`;

    const handleClick = async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
        alert(JSON.stringify(response.data));
    };
    return (
        <>
            <StyledDiv>
                <Typography variant="h4">Página Inicial</Typography>
                <Button variant="contained" color="primary" onClick={handleClick} sx={{ mt: 2 }}>
                    Fazer requisição com Axios
                </Button>
            </StyledDiv>


        </>
    )
}