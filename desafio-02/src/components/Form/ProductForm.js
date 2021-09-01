import React, { useState, useEffect } from 'react';
import { Container, Titulo } from '../../pages/Product/styled';
import productApi from '../../helpers/productApi';
import { useLocation } from 'react-router-dom';

import { Row, Col } from 'react-grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DataPicker from "../DataPicker/DataPicker";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '400px',
            marginTop: '15px'
        },
    }, formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        marginTop: '15px'
    },
    selectEmpty: {
        marginTop: '15px',
    },
}));

const ProductForm = () => {

    const classes = useStyles();


    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [dataFabricacao, setDataFabricacao] = useState(new Date());
    const [perecivel, setPerecivel] = useState(Boolean);
    const [dataValidade, setDataValidade] = useState(new Date());
    const [preco, setPreco] = useState('');
    const [error, setError] = useState('');
    const [newProduct, setNewProduct] = useState(true)
    const location = useLocation()

    const handleChangeRadio = (event) => {
        setPerecivel(event.target.value);
    };

    useEffect(() => {
        const { state } = location
        let dados = false
        if(state){
            const { create } = state
            setNewProduct(create)
            dados = state.dados
        }
        
        
        

        if (dados) {
            setId(dados.id)
            setNome(dados.nome)
            setDataFabricacao(dados.dataFabricacao)
            setPerecivel(dados.perecivel)
            setDataValidade(dados.dataValidade)
            setPreco(dados.preco)
        } else {
            setId('')
            setNome('')
            setDataFabricacao('')
            setPerecivel('')
            setDataValidade('')
            setPreco('')
        }

    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const json = newProduct ? await productApi.addProduct(nome, dataFabricacao, perecivel, dataValidade, preco) :
            await productApi.editProduct(id, nome, dataFabricacao, perecivel, dataValidade, preco)

        if (json.error) {
            setError(json.error);
            alert("Preencha todos os campos");
        } else {
            window.location.href = '/product';
        }
    };
    return (
        <Container>
            <Row>
                <Titulo>{newProduct ? 'Cadastrar' : 'Editar'} de Produtos</Titulo>
            </Row>
            <Row>
                <Col className={classes.root}>
                    <TextField id="standard-basic" label="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                </Col>
                <Col className={classes.root}>
                    <DataPicker selectedDate={dataFabricacao} setSelectedDate={setDataFabricacao} label="Data de Fabricação (dd/mm/yyyy)" />
                </Col>
            </Row>
            <Row>

                <Col className={classes.root}>
                    <TextField helperText="Exemplo: 9999.99" id="standard-basic" label="Valor de Venda" value={preco} onChange={e => setPreco(e.target.value)} />
                </Col>

                <Col className={classes.root}>
                    {perecivel === "true" ? <DataPicker selectedDate={dataValidade} setSelectedDate={setDataValidade} label="Data de Validade (dd/mm/yyyy)" /> : 
                        <DataPicker selectedDate={dataValidade} setSelectedDate={setDataValidade} label="Data de Validade (dd/mm/yyyy)" disabled/>
                    }
                    
                </Col>
            </Row>
            <Row>
                <Col className={classes.root}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Perecível</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={perecivel} onChange={handleChangeRadio}>
                            <FormControlLabel value="true" control={<Radio />} label="Sim" />
                            <FormControlLabel value="false" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </FormControl>
                </Col>
            </Row>
            <Row >
                <Col style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <Button variant="contained" color="primary" style={{ textTransform: "none", marginTop: "50px", padding: "5px 20px", width: "10%", cursor: "pointer" }} onClick={handleSubmit}>{newProduct ? 'Salvar' : 'Alterar'}</Button>
                </Col>
            </Row>

        </Container>
    );
}
export default ProductForm;