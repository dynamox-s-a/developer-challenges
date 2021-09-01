import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TablePagination from '@material-ui/core/TablePagination';
import { AiFillEdit, AiTwotoneDelete } from "react-icons/ai";
import { useHistory } from 'react-router-dom';
import productApi from '../../helpers/productApi';
import moment from 'moment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableCellAction = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        width: 100
    },
    body: {
        fontSize: 14,
        width: 100
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);



function ProductTable(props) {
    const history = useHistory()

    const useStyles = makeStyles(() => ({
        table: {
            maxWidth: 1110,
            width: "100%",

        },
        productTable: {
            marginTop: 25
        },
        icons: {
            width: 22,
            height: "auto",
            cursor: "pointer",


        },
        acoesIcons: {
            display: "flex",
            padding: "20%",
            height: "100%",
            minWidth: "125px",
            justifyContent: "space-around",
        },


    }));

    const classes = useStyles();

    const openEdit = (dados) => {
        history.push({ pathname: '/product-dados', state: { create: false, dados } })
    };


    const delProduct = async (dados) => {
        if (window.confirm('Deletar o item?')) {
            await productApi.deleteProduct(dados.id);

            props.reset();

        }
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer className={classes.productTable} component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Nome</StyledTableCell>
                            <StyledTableCell align="center">Data de fabricação</StyledTableCell>
                            <StyledTableCell align="center">Produto perecível</StyledTableCell>
                            <StyledTableCell align="center">Data de Validade</StyledTableCell>
                            <StyledTableCell align="right">Preço</StyledTableCell>
                            <StyledTableCellAction align="center">Ações</StyledTableCellAction>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((dados) => (
                            <StyledTableRow key={dados}>
                                <StyledTableCell align="left">{dados.nome}</StyledTableCell>
                                <StyledTableCell align="center">{moment(dados.dataFabricacao).format('DD/MM/YYYY')}</StyledTableCell>
                                <StyledTableCell align="center">{dados.perecivel === "true" ? <CheckCircleIcon style={{ color: "#00ff00  " }} /> : <CancelIcon style={{ color: "#ff0000  " }} />}</StyledTableCell>
                                <StyledTableCell align="center">{moment(dados.dataValidade).format('DD/MM/YYYY')}</StyledTableCell>
                                <StyledTableCell style={{ minWidth: "100px", maxWidth: "100px" }} align="right">{`R$ ${dados.preco}`}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.acoesIcons} >
                                    <AiFillEdit onClick={() => openEdit(dados)} className={classes.icons} />
                                    <AiTwotoneDelete onClick={() => delProduct(dados)} className={classes.icons} />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 100]}
                component="div"
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>

    );
}

export default ProductTable;
