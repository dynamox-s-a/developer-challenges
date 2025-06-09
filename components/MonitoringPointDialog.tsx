"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from "@mui/material"
import type { Machine, SensorModel } from "@/types"
import { api } from "@/services/api"

interface MonitoringPointDialogProps {
  open: boolean
  onClose: () => void
  machine: Machine | null
  onSuccess: () => void
  onError: (message: string) => void
}

export function MonitoringPointDialog({ open, onClose, machine, onSuccess, onError }: MonitoringPointDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sensorModel: "HF+" as SensorModel,
  })
  const [loading, setLoading] = useState(false)

  const sensorModels: SensorModel[] = ["TcAg", "TcAs", "HF+"]

  const getAvailableSensors = (): SensorModel[] => {
    if (machine?.type === "Pump") {
      return ["HF+"] // Only HF+ allowed for Pump machines
    }
    return sensorModels // All sensors allowed for Fan machines
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      onError("Nome do ponto é obrigatório")
      return
    }

    if (!machine) {
      onError("Máquina não selecionada")
      return
    }

    // Validate sensor model for Pump machines
    if (machine.type === "Pump" && (formData.sensorModel === "TcAg" || formData.sensorModel === "TcAs")) {
      onError("Sensores TcAg e TcAs não são permitidos para máquinas do tipo Pump")
      return
    }

    setLoading(true)
    try {
      await api.createMonitoringPoint({
        name: formData.name,
        machineId: machine.id,
        sensorModel: formData.sensorModel,
      })

      onSuccess()
      handleClose()
    } catch (error) {
      onError("Erro ao criar ponto de monitoramento")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", sensorModel: "HF+" })
      onClose()
    }
  }

  const availableSensors = getAvailableSensors()

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableEscapeKeyDown={loading}>
      <DialogTitle>
        Novo Ponto de Monitoramento
        {machine && ` - ${machine.name}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {machine?.type === "Pump" && (
            <Alert severity="info">Para máquinas do tipo Pump, apenas sensores HF+ são permitidos.</Alert>
          )}

          <TextField
            label="Nome do Ponto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
            disabled={loading}
          />

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Modelo do Sensor</InputLabel>
            <Select
              value={formData.sensorModel}
              label="Modelo do Sensor"
              onChange={(e) => setFormData({ ...formData, sensorModel: e.target.value as SensorModel })}
            >
              {availableSensors.map((sensor) => (
                <MenuItem key={sensor} value={sensor}>
                  {sensor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Criando..." : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
