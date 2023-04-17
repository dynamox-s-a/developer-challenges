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
import { formatDate } from "../services/helpers";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sort, setSort] = useState({
    column: "id",
    direction: "asc",
  });

  // const [sortOrder, setSortOrder] = useState("asc");
  // const [sortedColumn, setSortedColumn] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { products, isLoading } = useSelector((state) => state.productsSlice);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
    dispatch(fetchProducts())
  };

  const handleEditProduct = (id) => {
    dispatch(getProductById(id));
    navigate(`/user/editProduct/${id}`);
  };

  const handleSort = (columnName) => {
    // If the clicked column is already the one being sorted, toggle the sort direction
    if (sort.column === columnName) {
      setSort({
        column: columnName,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Otherwise, set the clicked column as the new sorting column, defaulting to ascending order
      setSort({
        column: columnName,
        direction: "asc",
      });
    }
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

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
                active={sort.column === "id"}
                direction={sort.direction}
                onClick={() => handleSort("id")}
              >
                Id
              </TableSortLabel>
            </TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Data de Fabricação</TableCell>
            <TableCell>Perecível</TableCell>
            <TableCell>Data de Validade</TableCell>
            <TableCell>Preço</TableCell>
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
