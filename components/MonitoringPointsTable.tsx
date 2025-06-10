"use client"

import { useState, useMemo } from "react"
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Pagination,
  Box,
  IconButton,
  Chip,
  Typography,
} from "@mui/material"
import { Delete } from "@mui/icons-material"
import type { Machine, MonitoringPoint } from "@/types"
import { api } from "@/services/api"
import { SafeTableContainer } from "./SafeTableContainer"

interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[]
  machines: Machine[]
  onMonitoringPointChange: () => void
  showNotification: (message: string, severity?: "success" | "error" | "warning" | "info") => void
}

type SortableColumn = "machineName" | "machineType" | "pointName" | "sensorModel"

interface Column {
  id: SortableColumn
  label: string
  minWidth?: number
}

const columns: Column[] = [
  { id: "machineName", label: "Nome da Máquina", minWidth: 150 },
  { id: "machineType", label: "Tipo da Máquina", minWidth: 120 },
  { id: "pointName", label: "Ponto de Monitoramento", minWidth: 180 },
  { id: "sensorModel", label: "Modelo do Sensor", minWidth: 130 },
]

export function MonitoringPointsTable({
  monitoringPoints,
  machines,
  onMonitoringPointChange,
  showNotification,
}: MonitoringPointsTableProps) {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortableColumn>("machineName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const itemsPerPage = 5

  // Join monitoring points with machines
  const pointsWithMachines = useMemo(() => {
    return monitoringPoints
      .map((point) => ({
        ...point,
        machine: machines.find((m) => m.id === point.machineId),
      }))
      .filter((point) => point.machine) // Filter out points without valid machines
  }, [monitoringPoints, machines])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...pointsWithMachines].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "machineName":
          aValue = a.machine?.name || ""
          bValue = b.machine?.name || ""
          break
        case "machineType":
          aValue = a.machine?.type || ""
          bValue = b.machine?.type || ""
          break
        case "pointName":
          aValue = a.name
          bValue = b.name
          break
        case "sensorModel":
          aValue = a.sensorModel
          bValue = b.sensorModel
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      }

      return 0
    })

    return sorted
  }, [pointsWithMachines, sortBy, sortOrder])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, page])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (column: SortableColumn) => {
    const isAsc = sortBy === column && sortOrder === "asc"
    setSortOrder(isAsc ? "desc" : "asc")
    setSortBy(column)
    setPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleDelete = async (pointId: string, pointName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o ponto "${pointName}"?`)) {
      try {
        await api.deleteMonitoringPoint(pointId)
        showNotification("Ponto de monitoramento excluído com sucesso!", "success")
        onMonitoringPointChange()
      } catch (error) {
        showNotification("Erro ao excluir ponto de monitoramento", "error")
      }
    }
  }

  return (
    <Box>
      <SafeTableContainer isEmpty={paginatedData.length === 0} emptyMessage="Nenhum ponto de monitoramento cadastrado">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortBy === column.id ? sortOrder : "asc"}
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((point) => (
            <TableRow hover key={point.id}>
              <TableCell>{point.machine?.name || "N/A"}</TableCell>
              <TableCell>
                {point.machine?.type && (
                  <Chip
                    label={point.machine.type}
                    size="small"
                    color={point.machine.type === "Pump" ? "primary" : "secondary"}
                  />
                )}
              </TableCell>
              <TableCell>{point.name}</TableCell>
              <TableCell>
                <Chip label={point.sensorModel} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(point.id, point.name)} size="small" color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </SafeTableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}

      {sortedData.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Mostrando {paginatedData.length} de {sortedData.length} registros
        </Typography>
      )}
    </Box>
  )
}
