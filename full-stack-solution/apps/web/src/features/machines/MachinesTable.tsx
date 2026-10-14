import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  MIN_MONITORING_POINTS_PER_MACHINE,
  type Machine,
} from "@full-stack-solution/shared";

export interface MachinesTableProps {
  machines: Machine[];
  onEdit: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
  onAddMonitoringPoint: (machine: Machine) => void;
}

/**
 * Machine list.
 *
 * Presentational on purpose: it receives rows and callbacks, which keeps it
 * trivial to test and reusable outside the page that owns the data.
 */
export function MachinesTable({
  machines,
  onEdit,
  onDelete,
  onAddMonitoringPoint,
}: MachinesTableProps) {
  return (
    <Table sx={{ minWidth: 640 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Monitoring points</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((machine) => {
          const belowMinimum =
            machine.monitoringPointsCount < MIN_MONITORING_POINTS_PER_MACHINE;

          return (
            <TableRow hover key={machine.id}>
              <TableCell>
                <Typography variant="subtitle2">{machine.name}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={machine.type}
                  size="small"
                  color={machine.type === "Pump" ? "warning" : "info"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Typography variant="body2">
                    {machine.monitoringPointsCount}
                  </Typography>
                  {belowMinimum ? (
                    <Chip
                      label={`Needs ${MIN_MONITORING_POINTS_PER_MACHINE}`}
                      size="small"
                      color="warning"
                    />
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ justifyContent: "flex-end" }}
                >
                  <Tooltip title="Add monitoring point">
                    <IconButton
                      aria-label={`Add monitoring point to ${machine.name}`}
                      onClick={() => onAddMonitoringPoint(machine)}
                      size="small"
                    >
                      <AddLocationAltOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label={`Edit ${machine.name}`}
                      onClick={() => onEdit(machine)}
                      size="small"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label={`Delete ${machine.name}`}
                      onClick={() => onDelete(machine)}
                      size="small"
                      color="error"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
