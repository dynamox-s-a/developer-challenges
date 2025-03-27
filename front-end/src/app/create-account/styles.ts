import styled from 'styled-components';
import Box from '@mui/material/Box'

export const Layout = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`
export const Container = styled(Box)`
    &.MuiBox-root {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        border: 2px solid #000;
        padding: 32px;
        background-color: white;
    }
`

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 40px;
`