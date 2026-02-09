"use client";

import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { LoginService } from "@/app/api/login";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/store";
import { setUser } from "../redux/slices/userSlice";

export function LoginForm() {
    
    const [form, setForm] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const loginService: LoginService = new LoginService();
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
            <Paper sx={{ width: { xs: "80%", sm: "30%" }, p: 4, gap: 2, display: "flex", flexDirection: "column" }}>
                <Image src={"/logo/Dynamox_cw.svg"} alt="Logo" width={100} height={100} />
                <Typography component="h1" sx={{ color: "text.primary", fontWeight: "bold", fontSize: 25 }}>Welcome Back!</Typography>
                <Typography component="p" sx={{ color: "text.secondary", fontWeight: "light" }}>Fill with your information to access yout account</Typography>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} label="E-mail" variant="outlined" />
                <TextField value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} label="Password" variant="outlined" type="password" />
                <Button onClick={() => loginService.login(form).then(data => { dispatch(setUser(data)), router.push("/dashboard") }).catch(error => setErrorMessage(error.message))} sx={{ backgroundColor: "#70163c", color: "#ffffff", py: 1.5 }}>Submit</Button>
            </Paper>
        </Box>
    );
}