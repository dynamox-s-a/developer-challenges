import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import api from '../helpers/Api';
import { doLogin } from '../helpers/AuthHandler'
import { Button, Container, Grid, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    form: {
        marginLeft: 550,
        padding:70
    },

}));

const Login = () => {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        const json = await api.login(email, password);
        if (json.error) {
            setError(json.error);
        } else {
            doLogin(json.token);
            window.location.href = '/Produtos';
        }
        setDisabled(false);
    }

    return (
        <Container component={Paper}>
            <div className={classes.form}>
                <form onSubmit={handleSubmit}>
                    <label className="area">
                        <div className="area--title">Email</div>
                        <div className="area--input">
                            <input type="email"
                               
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required />

                        </div>

                    </label>
                    <label className="area">
                        <div className="area--title">Senha</div>
                        <div className="area--input">
                            <input type="password"
                                
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required />
                        </div>

                    </label>



                    <div className="area">
                        <div className="area--title"></div>
                        <div className="area--input">
                            <button >Fazer Longin</button>
                        </div>

                    </div>
                </form>
            </div>


        </Container >

    );
}

export default Login;