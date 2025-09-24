import { Box, Chip } from "@mui/material";

interface StatsChipsProps {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  filteredEvents?: number;
  hasFilters?: boolean;
}

export default function StatsChips({
  totalEvents,
  upcomingEvents,
  pastEvents,
  filteredEvents,
  hasFilters = false,
}: StatsChipsProps) {
  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Chip label={`Total: ${totalEvents}`} color="primary" />
      <Chip label={`Próximos: ${upcomingEvents}`} color="success" />
      <Chip label={`Passados: ${pastEvents}`} color="default" />
      {hasFilters && filteredEvents !== undefined && (
        <Chip
          label={`Filtrados: ${filteredEvents}`}
          color="secondary"
          variant="outlined"
        />
      )}
    </Box>
  );
}
