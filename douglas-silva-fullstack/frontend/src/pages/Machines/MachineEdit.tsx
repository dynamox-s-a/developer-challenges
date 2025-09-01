import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Machine } from "../../services/api";
import { MachineService } from "../../services/api";

const typeOptions = [
  { value: 0, label: "Prensa" },
  { value: 1, label: "Torno" },
  { value: 2, label: "Fresadora" },
  { value: 3, label: "Cortadora" },
  { value: 4, label: "Furadeira" },
  { value: 5, label: "Outro" },
];

export default function MachineEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [machine, setMachine] = useState<Machine>({
    id: 0,
    name: "",
    serialNumber: "",
    description: "",
    type: 5,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MachineService.getById(Number(id));
        setMachine(data);
      } catch (err) {
        setError("Erro ao carregar os dados da máquina.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMachine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: SelectChangeEvent<number>) => {
    setMachine((prev) => ({
      ...prev,
      type: Number(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await MachineService.update(Number(id), machine);
      navigate(`/machines/${id}`, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar a máquina."
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Typography variant="h5" gutterBottom>
        Editar Máquina
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Nome"
              name="name"
              value={machine.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Número de Série"
              name="serialNumber"
              value={machine.serialNumber}
              onChange={handleChange}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={machine.type}
                label="Tipo"
                onChange={handleTypeChange}
                required
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Descrição"
              name="description"
              value={machine.description || ""}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
