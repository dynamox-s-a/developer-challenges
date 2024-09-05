import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TableSortLabel,
  CssBaseline,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs";

interface Sensor {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
}

type Order = "asc" | "desc";

const MonitoringDetailsPage = () => {
  const { id, monitoringId } = useParams<{
    id: string;
    monitoringId: string;
  }>();
  const [monitoringName, setMonitoringName] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Sensor>("name");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'https://dynamax-13e4b3075752.herokuapp.com/api'; // URL dinâmica da API


  useEffect(() => {
    const fetchMonitoringDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${apiUrl}/machines/${id}/monitorings/${monitoringId}`,
          config
        );
        setMonitoringName(response.data.name);
        setSensorType(response.data.type);
      } catch (error) {
        console.error("Erro ao buscar detalhes do monitoramento:", error);
      }
    };

    const fetchSensors = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${apiUrl}/machines/${id}/monitorings/${monitoringId}/sensors`,
          config
        );
        setSensors(response.data);
      } catch (error) {
        console.error("Erro ao buscar sensores:", error);
      }
    };

    fetchMonitoringDetails();
    fetchSensors();
  }, [id, monitoringId]);

  const handleRequestSort = (property: keyof Sensor) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAddSensor = () => {
    navigate(`/machines/${id}/monitorings/${monitoringId}/add-sensor`);
  };

  const handleEditSensor = (sensorId: string) => {
    navigate(
      `/machines/${id}/monitorings/${monitoringId}/sensors/${sensorId}/edit`
    );
  };

  const handleDeleteSensor = async (sensorId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token não encontrado");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(
        `${apiUrl}/machines/${id}/monitorings/${monitoringId}/sensors/${sensorId}`,
        config
      );

      setSensors(sensors.filter((sensor) => sensor._id !== sensorId));
    } catch (error) {
      console.error("Erro ao excluir sensor:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSensors = sensors.filter((sensor) =>
    sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSensors = filteredSensors.sort((a, b) => {
    if (orderBy === "createdAt") {
      return order === "asc"
        ? new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime()
        : new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
    } else {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
  });

  const paginatedSensors = sortedSensors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const breadcrumbs = [
    { label: "Máquinas", href: "/machines" },
    { label: "Monitoramento", href: `/machines/${id}` },
    { label: "Sensores" },
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>Gerenciamento de Monitoramentos</title>
      </Helmet>

      <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      <Divider />
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          {monitoringName} - {sensorType}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar sensor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Desativa o outline
                },
              },
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              boxShadow: "3px 6px 11px rgba(0, 0, 0, 0.1)",
              width: "300px",
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none", // Desativa o outline quando o campo está focado
              },
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 500 }}
          ></Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddSensor}
            sx={{
              backgroundColor: "#6366f1",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#4f46e5",
              },
              borderRadius: "8px",
              textTransform: "none",
              padding: "8px 16px",
            }}
          >
            Novo Sensor
          </Button>
        </Box>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: "800px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Nome do Sensor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Modelo do Sensor</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleRequestSort("createdAt")}
                    >
                      Última Alteração
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>ID Único</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSensors.map((sensor, index) => (
                  <TableRow hover key={sensor._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{sensor.name}</TableCell>
                    <TableCell>{sensor.status}</TableCell>
                    <TableCell>{sensorType}</TableCell>
                    <TableCell>
                      {new Date(sensor.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{sensor._id}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditSensor(sensor._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteSensor(sensor._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={filteredSensors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default MonitoringDetailsPage;
