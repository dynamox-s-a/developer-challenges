"use client";

import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectEventCounts } from "@/features/events/eventsSelectors";
import { fetchEvents } from "@/features/events/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const counts = useAppSelector(selectEventCounts);
  const { isLoading } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleManageEvents = () => {
    router.push("/admin/events");
  };

  const handleCreateEvent = () => {
    router.push("/admin/events/new");
  };

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {isLoading ? "..." : counts.total}
                  </Typography>
                  <Typography color="text.secondary">Total Events</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarTodayIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {isLoading ? "..." : counts.upcoming}
                  </Typography>
                  <Typography color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <HistoryIcon color="action" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {isLoading ? "..." : counts.past}
                  </Typography>
                  <Typography color="text.secondary">Past Events</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
          >
            Create New Event
          </Button>
          <Button variant="outlined" onClick={handleManageEvents}>
            Manage Events
          </Button>
        </Box>
      </Paper>
    </>
  );
}
