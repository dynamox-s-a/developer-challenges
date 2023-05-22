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
    LockOpen,
} from "@mui/icons-material";
import Image from "next/image";

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);

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
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Efetue seu login para acessar a aplicação.
                    </Typography>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="login-email">Email</InputLabel>
                        <Input
                            id="login-email"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="login-password">Senha</InputLabel>
                        <Input
                            id="login-password"
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
                        onClick={() => {
                            alert("Logou");
                        }}
                    >
                        Entrar
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
