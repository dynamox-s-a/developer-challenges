import {
  Box,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../../constants";
import {
  formatEventDate,
  formatCardDescription,
  formatEventCategory,
} from "../../../utils";
import type { Event } from "@/types";

interface EventsListProps {
  events: Event[];
  title: string;
  emptyMessage: string;
  chipColor: "success" | "default" | "error";
  isAdmin?: boolean;
}

export default function EventsList({
  events,
  title,
  emptyMessage,
  chipColor,
  isAdmin = false,
}: EventsListProps) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Chip label={events.length} color={chipColor} size="small" />
      </Box>

      {events.length === 0 ? (
        <Alert severity="info">{emptyMessage}</Alert>
      ) : (
        <Paper elevation={3} sx={{ maxHeight: 300, overflow: "auto" }}>
          <List>
            {events.map((event, index) => (
              <div key={event.id}>
                <ListItem
                  component={isAdmin ? "button" : "div"}
                  onClick={
                    isAdmin
                      ? () => {
                          router.push(
                            ROUTES.ADMIN.EVENTS.EDIT(String(event.id))
                          );
                        }
                      : undefined
                  }
                  sx={{
                    cursor: isAdmin ? "pointer" : "default",
                    "&:hover": isAdmin ? { backgroundColor: "grey.50" } : {},
                    border: "none",
                    padding: isAdmin ? "8px 16px" : "8px 16px",
                    textAlign: "left",
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  <ListItemText
                    sx={{
                      pointerEvents: isAdmin ? "none" : "auto",
                    }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          {event.name}
                        </Typography>
                        <Chip
                          label={formatEventCategory(event.category)}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          📅 {formatEventDate(event.date)}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          📍 {event.location}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {formatCardDescription(event.description)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < events.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
