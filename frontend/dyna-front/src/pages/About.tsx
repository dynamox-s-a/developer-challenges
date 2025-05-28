
import { Typography } from '@mui/material';
import styled from 'styled-components';


export default function AboutPage(){
    const AboutContainer = styled.div`
        margin-top: 20px;
    `;


    return(
        <>
            <AboutContainer>
                <Typography variant='h4'>Sobre</Typography>
                <Typography variant='body1' sx={{mt: 2}}>
                    Este é um app de exemplo usando React Material UI, Styled Compoentes, React Icons e Axios
                </Typography>
            </AboutContainer>
        </>
    )
}