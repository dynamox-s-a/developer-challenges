"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events";

export default function CreateEventPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/events");
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
        <Typography variant="h4" component="h1">
          Create New Event
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <EventForm />
      </Paper>
    </>
  );
}
