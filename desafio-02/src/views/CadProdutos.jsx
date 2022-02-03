import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Input, InputAdornment, MenuItem } from '@material-ui/core';
import { useState } from 'react';
import api from '../helpers/Api';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Creators as ProdutosActions } from "../store/ducks/Produtos";



const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        marginTop: '90px',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 230,
        },
    },
    form: {
        paddingLeft: 100,
        margin: 0


    }


}));




const CadProdutos = () => {
    const classes = useStyles();
    const dispatch = useDispatch();   
    const [id, setId] = useState('')
    const [nome, setNome] = useState('')
    const [datafab, setDatafab] = useState('')
    const [perecivel, setPerecivel] = useState('')
    const [datavenc, setDatavenc] = useState('')
    const [preco, setPreco] = useState('')
    const [isNew, setIsNew] = useState('');
    const location = useLocation();

    

    useEffect(() => {
        const { state } = location
        const { dados, create } = state
        setIsNew(create)
        
         if (dados) {
            setNome(dados.nome)
            setDatafab(dados.datafab)
            setPerecivel(dados.perecivel)
            setDatavenc(dados.datavenc)
            setPreco(dados.preco)
            setId(dados.id)


        } else {
            setNome("")
            setDatafab(moment(new Date('dd/mm/aaaa')))
            setPerecivel("")
            setDatavenc(new Date('dd/mm/aaaa'))
            setPreco("")

        }
    }, [])

    const handleSubmit = async () => {       
        const json = { nome, datafab, perecivel, datavenc, preco }
        console.log("JSON",json)
        dispatch(ProdutosActions.cadProdutosRequest(json));
            //: api.PutProdutos(id, nome, datafab, perecivel, datavenc, preco)
        
    }

    const currencies = [
        {
            value: true,
            label: 'Sim',
        },
        {
            value: false,
            label: 'Não',
        },

    ];
   

    return (
        <>
            <Container >
                <h1 className={classes.title}>{isNew ? "Cadastrar" : "Editar"} Produtos</h1>
                <Grid className={classes.form}>
                    <form className={classes.title} noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Grid container >
                            <Grid item xs={12}>
                                <TextField label="Nome" value={nome} onChange={e => setNome(e.target.value)} />

                                <TextField label="Data de Fabricação" position="start" type="date" value={datafab} onChange={e => setDatafab(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }} />

                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField label="Produto perecível"
                                        select
                                        value={perecivel}
                                        onChange={e => setPerecivel(e.target.value)}

                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    {!perecivel ? <TextField label="Data de validade" type="date" value={datavenc} onChange={e => setDatavenc(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                                        }}
                                        disabled /> : <TextField label="Data de validade" type="date" value={datavenc} onChange={e => setDatavenc(e.target.value)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                                            }}
                                    />}
                                    
                                    <TextField label="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Button variant="contained" color="primary" onClick={handleSubmit} >  Cadastrar Produtos</Button>

                    </form>
                </Grid>
            </Container>


        </>
    )

}

export default CadProdutos;