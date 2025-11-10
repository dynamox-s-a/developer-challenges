import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../services/api";

export interface MonitoringPoint {
  id: number; // Adicionado para a chave do DataGrid
  monitoring_point_name: string;
  machine_name?: string;
  machine_type?: string;
  sensor_model?: string;
}

export function MonitoringPointTable() {
  const [data, setData] = useState<MonitoringPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/monitoring-point", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      console.log("API response:", response);
      // A API retorna um array diretamente em .data ou em .data.items
      const rawData = response.data.items || response.data || [];
      const formattedData = rawData.map((item: any, index: number) => ({
        id: item.monitoring_point_id ?? item.id ?? index, // Garante que o ID correto seja usado
        machine_name: item.machine_name,
        machine_type: item.machine_type,
        monitoring_point_name: item.monitoring_point_name,
        sensor_model: item.sensor_model,
      }));
      setData(formattedData);
    } catch (error) {
      // Adicionando um log de erro mais visível
      console.error("Failed to fetch monitoring points:", error);
      // Você pode adicionar um feedback para o usuário aqui, como um Snackbar
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const columns: GridColDef[] = [
    // Nome da Máquina
    {
      field: "machine_name",
      headerName: "Nome da Máquina",
      flex: 1,
      minWidth: 180,
    },
    // Tipo da Máquina
    {
      field: "machine_type",
      headerName: "Tipo da Máquina",
      width: 180,
    },
    // Nome do Ponto de Monitoramento
    {
      field: "monitoring_point_name",
      headerName: "Nome do Ponto de Monitoramento",
      flex: 1,
      minWidth: 220,
    },
    // Modelo do Sensor
    {
      field: "sensor_model",
      headerName: "Modelo do Sensor",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 520 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Pontos de Monitoramento
        </Typography>
        <Tooltip title="Atualizar">
          <IconButton color="primary" onClick={fetchPoints}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        disableRowSelectionOnClick
        density="comfortable"
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        loading={loading}
        slots={{
          loadingOverlay: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          ),
        }}
      />
    </Box>
  );
}

export default MonitoringPointTable;
