import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import styles from '../styles/login.module.css';
import Button from '@mui/material/Button';
import {checkPasswordIdCorrect, checkEmailExists}  from '../middlewares/loginMiddleware';
import * as EmailValidator from 'email-validator'
import apiFake from '../pages/api/fakeApi';
import { authDataLogin } from '@/middlewares/authMiddleware';

const Login = () => {
  //const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    const emailExists = await checkEmailExists(email);
    if(!emailExists) { 
        setError(true);
        return window.alert("Crie uma conta clicando em registrar.")
    }
    const passwordCheck = await checkPasswordIdCorrect(password)
    if(!passwordCheck) {
        setError(true);
        return window.alert("Senha incorreta!");
    }
    await authDataLogin(email, password)
  };

    const handleRegister = async (email:string, password:string) => {
        const isEmailValid = EmailValidator.validate(email);
        if(!isEmailValid) return window.alert('Digite um email válido.');
        if(password.length < 6) return window.alert('A senha deve conter pelo menos 6 caracteres.')
        const response = await apiFake.post(`users`, {email, senha:password, })
        await authDataLogin(email, password);
  }

  return (
    <div className={styles.login}>
        <Box sx={{
        width: 300,
        height: 400,
        backgroundColor: "#f6f5f4",
        display: "flex",
        alignItems:"center",
        justifyContent: "center", 
        flexDirection: "column",
        borderRadius: 2, 

      }}>
        <h1>Login</h1>
            <form onSubmit={handleSubmit} className={styles.inputs}>
                <div>
                    <TextField error={error} id="outlined-basic" label="Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)}/>            
                </div>
                <div>
                    <TextField error={error} id="outlined-basic" label="Senha" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>            
                </div>
                <Box sx={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent: 'space-around',
                    marginTop: 2,
                    width:250

                }}>
                    <Button variant="outlined" onClick={() => { handleSubmit() }}>Entrar</Button>
                    <Button variant="outlined" onClick={() => { handleRegister(email,password) }}>Registrar</Button>
                </Box>
                
            </form>
        </Box>
    </div>
    );
};

export default Login;
