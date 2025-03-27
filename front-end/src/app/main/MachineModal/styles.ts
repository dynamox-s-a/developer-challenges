import styled from 'styled-components';
import Box from '@mui/material/Box';

export const Layout = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35%;
    height: 50%;
`

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

export const BoxStyled = styled(Box)`
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
        box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12);
    }
`