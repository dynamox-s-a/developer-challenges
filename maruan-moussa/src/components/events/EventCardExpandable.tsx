"use client";

import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { CalendarMonth, LocationOn } from "@mui/icons-material";
import { categoryColors, categoryMap } from "@/constants/eventCategories";
import { EventModel } from "@/dto/EventModelDto";

interface EventCardExpandableProps {
  event: EventModel;
  expandedId: string | null;
  onToggle: (id: string | null) => void;
  faded?: boolean;
}

export default function EventCardExpandable({
  event,
  expandedId,
  onToggle,
}: EventCardExpandableProps) {
    const expanded = expandedId === String(event.id);


  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        layout: { duration: 0.4, type: "spring" },
        opacity: { duration: 0.3 },
      }}
      onClick={() => onToggle(expanded ? null : String(event.id))}

      style={{
        borderRadius: 20,
        cursor: "pointer",
        overflow: "hidden",
        background: expanded
          ? "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(8,145,178,0.1))"
          : "rgba(255,255,255,0.05)",
        border: expanded
          ? "1px solid rgba(124,58,237,0.3)"
          : "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: expanded
          ? "0 15px 45px rgba(124,58,237,0.3)"
          : "0 5px 20px rgba(0,0,0,0.1)",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingLeft: "24px",
          paddingBottom: expanded ? "36px" : "24px",
        
      }}
    >
      <motion.div layout="position">
        <Chip
          label={categoryMap[event.category] || event.category}
          color={categoryColors[event.category] || "default"}
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "text.primary",
          }}
        >
          {event.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            color: "text.secondary",
          }}
        >
          <CalendarMonth sx={{ fontSize: 16, mr: 1 }} />
          {event.date}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: expanded ? 2 : 0,
            color: "text.secondary",
          }}
        >
          <LocationOn sx={{ fontSize: 16, mr: 1 }} />
          {event.location}
        </Box>
      </motion.div>

      {expanded && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {event.description}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}
