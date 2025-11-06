"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {  useEvents } from "@/hooks/useEventQueries";
import { ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import { Box, Chip, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { useFilteredEvents } from "@/hooks/useFilteredEvents";
import { PaginationControls } from "@/components/PaginationControls";
import { EventHeader } from "@/components/EventHeader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AdminEventsCards } from "@/components/admin/AdminEventsCards";
import { EventModel } from "@/dto/EventModelDto";
import { EventFormModal } from "@/components/admin/EventFormModal";
import { DeleteEventConfirmDialog } from "@/components/admin/DeleteEventConfirmDialog";
import { categoryColors, categoryMap } from "@/constants/eventCategories";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material";


export default function AdminPage() {
  const { data: events = [], isLoading, isError } = useEvents()
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventModel | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventModel | null>(null);
  const theme = useTheme();

  const handleDeleteEvent = (event: EventModel) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const filteredEvents = useFilteredEvents({
    events,
    filter: search,
    sortOrder,
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedEvents,
    nextPage,
    prevPage,
    isFirstPage,
    isLastPage,
  } = usePagination({
    data: filteredEvents,
    itemsPerPage,
  });

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: EventModel) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "rgba(25, 25, 25, 0.8)"
              : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(16px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.6)"
              : "0 8px 24px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Box sx={{ flex: 1, mt: 8 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                Eventos
              </Typography>
              <EventHeader
                filter={search}
                setFilter={setSearch}
                onAddEvent={handleCreateEvent}
              />

              {isLoading && (
                <Typography sx={{ textAlign: "center", mt: 4 }}>Carregando eventos...</Typography>
              )}

              {isError && (
                <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
                  Erro ao carregar eventos. Tente novamente.
                </Typography>
              )}
              {isMobile ? (
                <AdminEventsCards
                  events={paginatedEvents}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Table
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      "& th, & td": { borderBottom: "1px solid rgba(255,255,255,0.08)" },
                    }}
                  >
                    <TableHead>
                      <TableRow sx={{ background: "rgba(255, 255, 255, 0.05)" }}>
                        <TableCell sx={{ fontWeight: 700 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            Nome do Evento
                            <IconButton
                              size="small"
                              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                              sx={{ p: 0, ml: 0.5 }}
                            >
                              {sortOrder === "asc" ? (
                                <ArrowUpward fontSize="inherit" sx={{ fontSize: 18 }} />
                              ) : (
                                <ArrowDownward fontSize="inherit" sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Local</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "text.secondary",
                                fontStyle: "italic",
                                opacity: 0.8,
                                userSelect: "none",
                              }}
                            >
                              Nenhum evento cadastrado até o momento.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedEvents.map((event) => (
                          <TableRow key={event.id} hover>
                            <TableCell>{event.title}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                              <Chip
                                label={categoryMap[event.category] || event.category}
                                color={categoryColors[event.category] || "default"}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                maxWidth: 240,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                verticalAlign: "middle",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: "text.secondary",
                                  }}
                                >
                                  {event.description}
                                </Typography>

                                <Tooltip
                                  title={
                                    <Box
                                      sx={{
                                        maxWidth: 320,
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        fontSize: "0.9rem",
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#e0e0ff"
                                            : theme.palette.text.primary,
                                      }}
                                    >
                                      {event.description}
                                    </Box>
                                  }
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        background:
                                          theme.palette.mode === "dark"
                                            ? "linear-gradient(180deg, rgba(18,18,18,0.95), rgba(30,30,30,0.9))"
                                            : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))",
                                        backdropFilter: "blur(14px)",
                                        border:
                                          theme.palette.mode === "dark"
                                            ? "1px solid rgba(124,58,237,0.3)"
                                            : "1px solid rgba(59,130,246,0.3)",
                                        boxShadow:
                                          theme.palette.mode === "dark"
                                            ? "0 8px 24px rgba(0,0,0,0.4), inset 0 0 12px rgba(124,58,237,0.15)"
                                            : "0 8px 24px rgba(0,0,0,0.12), inset 0 0 10px rgba(59,130,246,0.08)",
                                        borderRadius: "12px",
                                        padding: "10px 14px",
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "#cfc2ff"
                                            : theme.palette.text.primary,
                                        fontWeight: 400,
                                        lineHeight: 1.4,
                                        transition: "all 0.25s ease",
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "rgba(18,18,18,0.95)"
                                            : "rgba(255,255,255,0.95)",
                                        "&::before": {
                                          border:
                                            theme.palette.mode === "dark"
                                              ? "1px solid rgba(124,58,237,0.3)"
                                              : "1px solid rgba(59,130,246,0.3)",
                                        },
                                      },
                                    },
                                  }}
                                >
                                  <InfoOutlinedIcon
                                    sx={{
                                      fontSize: 18,
                                      color: "primary.main",
                                      cursor: "pointer",
                                      opacity: 0.7,
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        opacity: 1,
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  />
                                </Tooltip>

                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleEditEvent(event)}
                                sx={{ mr: 1 }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteEvent(event)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            px: 3,
                            py: 2,
                            background: "rgba(255,255,255,0.02)",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                            onPrevPage={prevPage}
                            onNextPage={nextPage}
                            isFirstPage={isFirstPage}
                            isLastPage={isLastPage}
                          />
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              )}
            </Container>
          </Box>
        </Box>

        <EventFormModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(undefined);
          }}
          editingEvent={editingEvent}
        />

        <DeleteEventConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setEventToDelete(null);
          }}
          event={eventToDelete}
        />
      </Paper>
    </ProtectedRoute>
  );
}
