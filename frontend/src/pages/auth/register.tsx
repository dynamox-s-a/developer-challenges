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

export default function Register() {
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
                        Cadastre-se
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Informe seus dados para acessar a plataforma.
                    </Typography>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="register-name">Nome</InputLabel>
                        <Input
                            id="register-name"
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
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="register-password">Senha</InputLabel>
                        <Input
                            id="register-password"
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
                        Cadastrar
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
