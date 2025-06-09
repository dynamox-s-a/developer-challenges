"use client"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import type { Machine } from "@/types"
import { api } from "@/services/api"
import { MonitoringPointDialog } from "./MonitoringPointDialog"

interface MachineListProps {
  machines: Machine[]
  onMachineChange: () => void
  onMonitoringPointChange: () => void
  showNotification: (message: string, severity?: "success" | "error" | "warning" | "info") => void
}

export function MachineList({
  machines,
  onMachineChange,
  onMonitoringPointChange,
  showNotification,
}: MachineListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "Pump" as "Pump" | "Fan" })
  const [monitoringPointDialogOpen, setMonitoringPointDialogOpen] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showNotification("Nome da máquina é obrigatório", "error")
      return
    }

    setLoading(true)
    try {
      if (editingMachine) {
        await api.updateMachine(editingMachine.id, formData)
        showNotification("Máquina atualizada com sucesso!", "success")
      } else {
        await api.createMachine(formData)
        showNotification("Máquina criada com sucesso!", "success")
      }
      onMachineChange()
      handleCloseDialog()
    } catch (error) {
      showNotification("Erro ao salvar máquina", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (machine: Machine) => {
    if (window.confirm(`Tem certeza que deseja excluir a máquina "${machine.name}"?`)) {
      try {
        await api.deleteMachine(machine.id)
        showNotification("Máquina excluída com sucesso!", "success")
        onMachineChange()
      } catch (error) {
        showNotification("Erro ao excluir máquina", "error")
      }
    }
  }

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine)
    setFormData({ name: machine.name, type: machine.type })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    if (!loading) {
      setDialogOpen(false)
      setEditingMachine(null)
      setFormData({ name: "", type: "Pump" })
    }
  }

  const handleCreateMonitoringPoint = (machine: Machine) => {
    setSelectedMachine(machine)
    setMonitoringPointDialogOpen(true)
  }

  return (
    <Box>
      <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)} sx={{ mb: 2 }} fullWidth>
        Nova Máquina
      </Button>

      <List>
        {machines.map((machine) => (
          <ListItem key={machine.id} divider>
            <ListItemText
              primary={machine.name}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={machine.type}
                    size="small"
                    color={machine.type === "Pump" ? "primary" : "secondary"}
                    sx={{ mr: 1 }}
                  />
                  <Button size="small" variant="outlined" onClick={() => handleCreateMonitoringPoint(machine)}>
                    Criar Ponto
                  </Button>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEdit(machine)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(machine)} size="small" color="error">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {machines.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
          Nenhuma máquina cadastrada
        </Typography>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth disableEscapeKeyDown={loading}>
        <DialogTitle>{editingMachine ? "Editar Máquina" : "Nova Máquina"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nome da Máquina"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              disabled={loading}
            />
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                label="Tipo"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "Pump" | "Fan" })}
              >
                <MenuItem value="Pump">Pump</MenuItem>
                <MenuItem value="Fan">Fan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Salvando..." : editingMachine ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      <MonitoringPointDialog
        open={monitoringPointDialogOpen}
        onClose={() => setMonitoringPointDialogOpen(false)}
        machine={selectedMachine}
        onSuccess={() => {
          onMonitoringPointChange()
          showNotification("Ponto de monitoramento criado com sucesso!", "success")
        }}
        onError={(message) => showNotification(message, "error")}
      />
    </Box>
  )
}
