import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Machine } from "../../services/api";
import { MachineService } from "../../services/api";

type MachineFormData = Omit<Machine, "id" | "createdAt" | "updatedAt">;

const MachineForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MachineFormData>({
    name: "",
    serialNumber: "",
    description: "",
    type: 5, // Outro por padrão
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MachineFormData, string>>>({});

  useEffect(() => {
    if (isEditing && id) {
      const fetchMachine = async () => {
        try {
          const machine = await MachineService.getById(parseInt(id));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: machineId, createdAt, updatedAt, ...machineData } = machine;
          setFormData(machineData);
        } catch (err) {
          setError("Erro ao carregar os dados da máquina.");
          console.error("Error fetching machine:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchMachine();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target as { name: 'type'; value: string };
    // Garante que o valor seja um número
    const numericValue = parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MachineFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "O número de série é obrigatório";
    }

    if (!formData.type) {
      newErrors.type = "O tipo da máquina é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditing && id) {
        await MachineService.update(parseInt(id), formData);
      } else {
        await MachineService.create(formData);
      }

      try { localStorage.removeItem("assets_tree_v1"); } catch (err) { void err; }

      navigate("/machines");
    } catch (err) {
      setError("Erro ao salvar a máquina. Tente novamente.");
      console.error("Error saving machine:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">{isEditing ? "Editar Máquina" : "Nova Máquina"}</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/machines")}
        >
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />

            <TextField
              label="Número de Série"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              error={!!errors.serialNumber}
              helperText={errors.serialNumber}
              fullWidth
              required
            />

            <FormControl fullWidth error={!!errors.type} required>
              <InputLabel id="machine-type-label">Tipo de Máquina</InputLabel>
              <Select
                labelId="machine-type-label"
                name="type"
                value={String(formData.type)}
                label="Tipo de Máquina"
                onChange={handleSelectChange}
              >
                <MenuItem value={"0"}>Prensa</MenuItem>
                <MenuItem value={"1"}>Torno</MenuItem>
                <MenuItem value={"2"}>Fresadora</MenuItem>
                <MenuItem value={"3"}>Cortadora</MenuItem>
                <MenuItem value={"4"}>Furadeira</MenuItem>
                <MenuItem value={"5"}>Outro</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>

            <TextField
              label="Descrição"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/machines")} disabled={saving}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MachineForm;
