import * as React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    Typography,
    Input,
    IconButton,
    Grid,
    Link
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Email,
    LockOpen,
    LineAxisOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/features/user";
import Router from "next/router";
import { makeStyles } from "@mui/material";

export default function Login() {

    //State variables
    const [ loginEmail, setLoginEmail ] = React.useState("");
    const [ loginPassword, setLoginPassword ] = React.useState("");

    //Redux variables
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.value);

    const handleLogin = () =>  {
        
        const url = "http://localhost:8000/login";

        axios
            .post(url, { "email": loginEmail, "password": loginPassword }, { headers: { "Content-Type": "application/json",}})
            .then(response => {
                dispatch(login(response.data));
                Router.push("/profile/dashboard");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            })
    }

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent='center' sx={{ minHeight: "100vh",  background: "url('/grafismo.png') no-repeat center center fixed" }}>
            <Card sx={{ maxWidth: '566px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ m: 2, marginBottom: 2 }}>
                        Efetue seu login para acessar a aplicação.
                    </Typography>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="login-email">Email</InputLabel>
                        <Input
                            id="login-email"
                            value={loginEmail}
                            onChange={(e) => { setLoginEmail(e.target.value) }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="login-password">Senha</InputLabel>
                        <Input
                            id="login-password"
                            value={loginPassword} 
                            onChange={(e) => { setLoginPassword(e.target.value) }}
                            type={showPassword ? "text" : "password"}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LockOpen />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="exibir senha"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </CardContent>
                <CardActions variant="align-right">
                    <Link href="/auth/register" sx={{ marginRight: 4 }}>Não possui uma conta? Cadastre-se</Link>
                    <Button
                        variant="contained"
                        onClick={handleLogin}
                    >
                        Entrar
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
