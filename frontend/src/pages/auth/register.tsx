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
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    AccountCircle,
    Email,
    LockOpen,
} from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import Router from "next/router";

export default function Register() {

    //State variables
    const [ registerEmail, setRegisterEmail ] = React.useState("");
    const [ registerPassword, setRegisterPassword ] = React.useState("");
    const [ registerName, setRegisterName ] = React.useState("");

    const [showPassword, setShowPassword] = React.useState(false);

    const handleRegister = () =>  {
        
        const url = "http://localhost:8000/users";

        axios
            .post(url, { "email": registerEmail, "password": registerPassword, "name": registerName }, { headers: { "Content-Type": "application/json" }})
            .then(response => {
                alert("Usuário criado com sucesso");
                Router.push("/auth/login");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            })
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent='center' sx={{ minHeight: '100vh' }}>
            Imagem aqui
            <Card sx={{ maxWidth: '566px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Cadastre-se
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ m: 2, marginBottom: 2 }}>
                        Informe seus dados para acessar a plataforma.
                    </Typography>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="register-name">Nome</InputLabel>
                        <Input
                            id="register-name"
                            value={registerName}
                            onChange={(e) => {setRegisterName(e.target.value)}}
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="register-email">Email</InputLabel>
                        <Input
                            id="register-email"
                            value={registerEmail}
                            onChange={(e) => {setRegisterEmail(e.target.value)}}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="register-password">Senha</InputLabel>
                        <Input
                            id="register-password"
                            value={registerPassword}
                            onChange={(e) => {setRegisterPassword(e.target.value)}}
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
                    <Button
                        variant="contained"
                        onClick={handleRegister}
                    >
                        Cadastrar
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
