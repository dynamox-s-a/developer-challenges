import './Button.scss'
import Button from '@mui/material/Button';

function ButtonDyna(props) {
    return <Button  variant="contained" onClick={props.clickButton}>{props.text}</Button>
}

export default ButtonDyna