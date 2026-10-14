import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import type {
  MonitoringPoint,
  MonitoringPointSortField,
  SortOrder,
} from "@full-stack-solution/shared";
import {
  SortableTableHead,
  type SortableColumn,
} from "@web/components/common/SortableTableHead";

export interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[];
  sortBy: MonitoringPointSortField;
  order: SortOrder;
  onSort: (field: MonitoringPointSortField) => void;
  onRename: (point: MonitoringPoint) => void;
  onAssignSensor: (point: MonitoringPoint) => void;
  onRemoveSensor: (point: MonitoringPoint) => void;
  onDelete: (point: MonitoringPoint) => void;
}

/** Columns required by the challenge, plus a non-sortable actions column. */
const columns: SortableColumn<MonitoringPointSortField>[] = [
  { field: "machineName", label: "Machine name" },
  { field: "machineType", label: "Machine type" },
  { field: "name", label: "Monitoring point name" },
  { field: "sensorModel", label: "Sensor model" },
  { label: "Actions", align: "right" },
];

/**
 * Paginated monitoring points list.
 *
 * Sorting and pagination are server-side, so this component only reports the
 * clicked column and renders the rows it is given.
 */
export function MonitoringPointsTable({
  monitoringPoints,
  sortBy,
  order,
  onSort,
  onRename,
  onAssignSensor,
  onRemoveSensor,
  onDelete,
}: MonitoringPointsTableProps) {
  return (
    <Table sx={{ minWidth: 800 }}>
      <SortableTableHead
        columns={columns}
        sortBy={sortBy}
        order={order}
        onSort={onSort}
      />
      <TableBody>
        {monitoringPoints.map((point) => (
          <TableRow hover key={point.id}>
            <TableCell>{point.machineName}</TableCell>
            <TableCell>
              <Chip
                label={point.machineType}
                size="small"
                color={point.machineType === "Pump" ? "warning" : "info"}
                variant="outlined"
              />
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">{point.name}</Typography>
            </TableCell>
            <TableCell>
              {point.sensorModel ? (
                <Stack spacing={0.25}>
                  <Typography variant="body2">{point.sensorModel}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {point.sensorId}
                  </Typography>
                </Stack>
              ) : (
                <Chip label="No sensor" size="small" variant="outlined" />
              )}
            </TableCell>
            <TableCell align="right">
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ justifyContent: "flex-end" }}
              >
                <Tooltip
                  title={point.sensorId ? "Replace sensor" : "Assign sensor"}
                >
                  <IconButton
                    aria-label={`${point.sensorId ? "Replace" : "Assign"} sensor of ${point.name}`}
                    onClick={() => onAssignSensor(point)}
                    size="small"
                  >
                    <SensorsOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {point.sensorId ? (
                  <Tooltip title="Remove sensor">
                    <IconButton
                      aria-label={`Remove sensor from ${point.name}`}
                      onClick={() => onRemoveSensor(point)}
                      size="small"
                    >
                      <LinkOffOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <Tooltip title="Rename">
                  <IconButton
                    aria-label={`Rename ${point.name}`}
                    onClick={() => onRename(point)}
                    size="small"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label={`Delete ${point.name}`}
                    onClick={() => onDelete(point)}
                    size="small"
                    color="error"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
