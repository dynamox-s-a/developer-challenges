import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import '../assets/css/tablecliente.css';
import api from '../helpers/Api';
import { useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from "react-redux";
import { Creators as ProdutosActions } from "../store/ducks/Produtos";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
    },
    body: {
        fontSize: 12,
    },

}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    wrow: {
        width: '555px',
    }


}))(TableRow);


const useStyles = makeStyles({
    table: {
        minWidth: 700,
        marginTop: 30,
        maxWidth: 400,
        marginLeft: 300,
        marginBottom:45
    }, icons: {
        width: 33,
        cursor: "pointer",
    },
    acoesIcons: {
        display: "flex",
        justifyContent: "space-around"
    },
    addProdutos: {
        marginTop: 100,
        marginLeft: 300,

    },
    button: {
        whiteSpace: 'nowrap'

    }


});

const produtosListSelector = ({ Produtos }) => Produtos.produtosList;



export default function Produtos() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const produtosList = useSelector(produtosListSelector);



    useEffect(() => {
        dispatch(ProdutosActions.getProdutosRequest())
    }, []);




    const handleDel = async (dados) => {
        const json = await api.DelProdutos(dados.id)
        if (json.error) {
            console.log("erro")
        } else {
            window.location.href = '/produtos';
        }
    };


    const maskMoney = (value) => {
        value = `R$ ${value.toLocaleString("pt-BR")}`

        if(value.indexOf(',') === -1){
            value = value + ',00'
        }

        return value
    }


    return (<Container>
        <Grid className={classes.addProdutos}>
            <Link to={{ pathname: "/cadprodutos", state: { dados: false, create: true } }}>
                <Button variant="contained" color="primary" className={classes.button} >
                    Adicionar Produtos</Button>
            </Link>
        </Grid>
        <TableContainer>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center" >Nome</StyledTableCell>
                        <StyledTableCell align="center">Data de fabricação</StyledTableCell>
                        <StyledTableCell align="center">Produto perecível  </StyledTableCell>
                        <StyledTableCell align="center">Data de validade</StyledTableCell>
                        <StyledTableCell align="center">Preço</StyledTableCell>
                        <StyledTableCell align="center">Ações</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtosList.map((dados) => (
                        <StyledTableRow key={dados}>
                            <StyledTableCell className={classes.wrow} component="th" scope="row">
                                {dados.nome}
                            </StyledTableCell>
                            <StyledTableCell className={classes.wrow} align="center">{moment(dados.datafab).format("DD/MM/YYYY ").toString()}</StyledTableCell>
                            <StyledTableCell className={classes.wrow} align="center">
                                {console.log(dados.perecivel)}
                                {dados.perecivel === false
                                    ? <CloseIcon style={{color:"red"}}/>
                                    : <CheckIcon style={{color:"green"}}/>}
                            </StyledTableCell>

                            <StyledTableCell className={classes.wrow} align="center">{moment(dados.datavenc).format("DD/MM/YYYY ").toString()}</StyledTableCell>
                            { <StyledTableCell className={classes.wrow} align="center">{maskMoney(dados.preco)}</StyledTableCell> }
                            <StyledTableCell className={classes.wrow} align="center" className={classes.acoesIcons} >
                                <Link to={{ pathname: "/cadprodutos", state: { dados, create: false } }}>
                                    <EditIcon className={classes.icons} />
                                </Link>
                                <DeleteIcon onClick={() => handleDel(dados)} className={classes.icons} />
                            </StyledTableCell>

                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
    );
}
