"use client";

import { Box, Typography, Paper } from "@mui/material";
import { EventModel } from "@/dto/EventModelDto";
import { useTheme } from "@mui/material";
import { EventGrid } from "@/components/events/EventGrid";
import { PaginationControls } from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AdminEventsCardsProps {
  events: EventModel[];
  onEdit: (event: EventModel) => void;
  onDelete: (event: EventModel) => void;
}

export const AdminEventsCards = ({
  events,
  onEdit,
  onDelete,
}: AdminEventsCardsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const {
    paginatedData,
    currentPage,
    totalPages,
    isFirstPage,
    isLastPage,
    nextPage,
    prevPage,
  } = usePagination<EventModel>(events, isMobile ? 4 : events.length);

  if (!events.length) {
    return (
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          opacity: 0.8,
          textAlign: "center",
          mt: 4,
        }}
      >
        Nenhum evento cadastrado até o momento.
      </Typography>
    );
  }

  return (
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
      <Box sx={{ mt: 2 }}>
        <EventGrid
          events={isMobile ? paginatedData : events}
          faded={false}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {isMobile && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        )}
      </Box>
    </Paper>
  );
};
