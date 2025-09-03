import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Button,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import type { Machine } from "../../services/api";
import { MachineService } from "../../services/api";

// Mapeia os valores do enum MachineType do backend
const typeLabels = ["Prensa", "Torno", "Fresadora", "Cortadora", "Furadeira", "Outro"] as const;

const labelForType = (t?: number) => {
  if (typeof t !== 'number') return '—';
  // Garante que o índice está dentro dos limites do array
  return typeLabels[t] || `Tipo ${t}`;
};

export default function MachineDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [machine, setMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MachineService.getById(Number(id));
        setMachine(data);
      } catch (err) {
        setError("Erro ao carregar os detalhes da máquina.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!machine) {
    return <Alert severity="warning">Máquina não encontrada.</Alert>;
  }

  const createdAt = machine.createdAt ? new Date(machine.createdAt).toLocaleString("pt-BR") : "-";
  const updatedAt = machine.updatedAt ? new Date(machine.updatedAt).toLocaleString("pt-BR") : "-";

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Detalhes da Máquina</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/machines")}>Voltar</Button>
      </Stack>

      <Paper sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Informações Gerais</Typography>
          <Tooltip title="Editar máquina">
            <IconButton 
              color="primary" 
              onClick={() => navigate(`/machines/${id}/edit`)}
              aria-label="editar máquina"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Nome</Typography>
            <Typography>{machine.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Número de Série</Typography>
            <Typography>{machine.serialNumber}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
            <Chip label={labelForType(machine.type)} color="primary" variant="outlined" />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
            <Typography>{machine.description || "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Criada em</Typography>
            <Typography>{createdAt}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Atualizada em</Typography>
            <Typography>{updatedAt}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
