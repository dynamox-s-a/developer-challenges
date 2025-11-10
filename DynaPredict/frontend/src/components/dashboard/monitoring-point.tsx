import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface MonitoringPoint {
  id: number;
  name: string;
  machine: string;
  sensor_model: string;
  created_at: string;
  status: "active" | "inactive" | "fault";
}

interface MonitoringPointTableProps {
  data: MonitoringPoint[];
  loading?: boolean;
  onRefresh?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function MonitoringPointTable({
  data,
  loading = false,
  onRefresh,
  onEdit,
  onDelete,
}: MonitoringPointTableProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Ponto de Monitoramento",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "machine",
      headerName: "Máquina",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "sensor_model",
      headerName: "Sensor",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        const color =
          params.value === "active"
            ? "success"
            : params.value === "inactive"
            ? "default"
            : "error";
        const label =
          params.value === "active"
            ? "Ativo"
            : params.value === "inactive"
            ? "Inativo"
            : "Falha";
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: "created_at",
      headerName: "Criado em",
      flex: 1,
      minWidth: 150, // Ensure params.value is treated as a string or Date
      valueFormatter: (params: GridRenderCellParams<MonitoringPoint, string>) =>
        new Date(params.value as string).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          {onEdit && (
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(params.row.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Excluir">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(params.row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
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
        {onRefresh && (
          <Tooltip title="Atualizar">
            <IconButton color="primary" onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        density="comfortable"
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
