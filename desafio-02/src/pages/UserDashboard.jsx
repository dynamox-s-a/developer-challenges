import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  fetchProducts,
  getProductById,
} from "../redux/products/productsActions";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Header } from "../components/header";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  formatDate,
  sortByExpirationDate,
  sortById,
  sortByManufactureDate,
  sortByName,
  sortByPerishable,
  sortByPrice,
} from "../services/helpers";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { products } = useSelector((state) => state.productsSlice);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (id) => {
    dispatch(deleteProduct(id));
    dispatch(fetchProducts());
  };

  const handleEditProduct = (id) => {
    dispatch(getProductById(id));
    navigate(`/user/editProduct/${id}`);
  };

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const sortedProducts = products.slice().sort((a, b) => {
    const isAsc = order === "asc";
    switch (orderBy) {
      case "id":
        return sortById(a, b, isAsc);
      case "name":
        return sortByName(a, b, isAsc);
      case "manufactureDate":
        return sortByManufactureDate(a, b, isAsc);
      case "perishable":
        return sortByPerishable(a, b, isAsc);
      case "expirationDate":
        return sortByExpirationDate(a, b, isAsc);
      case "price":
        return sortByPrice(a, b, isAsc);
      default:
        return 0;
    }
  });

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <Typography component="h2" variant="h4">
        Lista de Produtos
      </Typography>
      <Table className="table-container">
        <TableHead className="table-header">
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "id"}
                direction={order}
                onClick={() => handleSort("id")}
              >
                Id
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={order}
                onClick={() => handleSort("name")}
              >
                Nome
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "manufactureDate"}
                direction={order}
                onClick={() => handleSort("manufactureDate")}
              >
                Data de Fabricação
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "perishable"}
                direction={order}
                onClick={() => handleSort("perishable")}
              >
                Perecível
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "expirationDate"}
                direction={order}
                onClick={() => handleSort("expirationDate")}
              >
                Data de Validade
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "price"}
                direction={order}
                onClick={() => handleSort("price")}
              >
                Preço
              </TableSortLabel>
            </TableCell>
            <TableCell>Editar</TableCell>
            <TableCell>Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProducts &&
            paginatedProducts.map((product, index) => (
              <TableRow className="table-row" key={index}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatDate(product.manufactureDate)}</TableCell>
                <TableCell>{product.perishable ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {product.expirationDate
                    ? formatDate(product.expirationDate)
                    : "-"}
                </TableCell>
                <TableCell>{`R$ ${product.price.toFixed(2)}`}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditProduct(product.id)}>
                    <ModeEditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteOutlineIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
