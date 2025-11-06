"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { EventModel } from "@/dto/EventModelDto";
import { categoryMap } from "@/constants/eventCategories";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.05 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              background:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(25, 25, 25, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                transform: "translateY(-2px)",
                transition: "0.3s ease",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.9rem" }}
              >
                📅 {event.date}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.9rem" }}
              >
                📍 {event.location}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Chip
                  label={categoryMap[event.category] || event.category}
                  variant="outlined"
                  color="primary"
                  size="small"
                />

                <Box>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(event)}
                    sx={{
                      color: "primary.main",
                      "&:hover": { color: "primary.light" },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(event)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {event.description && (
                <Tooltip
                  title={
                    <Box
                      sx={{
                        maxWidth: 300,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        fontSize: "0.9rem",
                      }}
                    >
                      {event.description}
                    </Box>
                  }
                  arrow
                  placement="top"
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
                      mt: 1,
                      alignSelf: "flex-start",
                    }}
                  />
                </Tooltip>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
    </Paper>
  );
};
