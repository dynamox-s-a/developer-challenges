"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { Event, SortOrder } from "@/types";
import { CATEGORY_COLORS } from "../constants";
import { deleteEvent } from "../eventsSlice";
import { formatDateTime, isUpcoming } from "../utils";

interface EventsTableProps {
  events: Event[];
  sortField: "name" | "dateTime";
  sortOrder: SortOrder;
  onSortChange: (field: "name" | "dateTime") => void;
}

export function EventsTable({
  events,
  sortField,
  sortOrder,
  onSortChange,
}: EventsTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.events);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const handleEdit = (eventId: string) => {
    router.push(`/admin/events/${eventId}/edit`);
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      try {
        await dispatch(deleteEvent(eventToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        setEventToDelete(null);
      } catch {
        // Error handled by Redux state
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No events found. Create your first event!
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="events table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => onSortChange("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "dateTime"}
                  direction={sortField === "dateTime" ? sortOrder : "asc"}
                  onClick={() => onSortChange("dateTime")}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight={500}>
                    {event.name}
                  </Typography>
                </TableCell>
                <TableCell>{formatDateTime(event.dateTime)}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Chip
                    label={event.category}
                    color={CATEGORY_COLORS[event.category]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={isUpcoming(event.dateTime) ? "Upcoming" : "Past"}
                    color={isUpcoming(event.dateTime) ? "success" : "default"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(event.id)}
                        disabled={isLoading}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(event)}
                        disabled={isLoading}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot;{eventToDelete?.name}&quot;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
