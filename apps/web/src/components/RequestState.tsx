import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface RequestStateProps {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onRetry: () => void;
  children: ReactNode;
}

export function RequestState({
  status,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  onRetry,
  children,
}: RequestStateProps) {
  if (status === "idle" || status === "loading") {
    return (
      <Box
        alignItems="center"
        aria-label="Loading"
        display="flex"
        justifyContent="center"
        minHeight={240}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Alert
        action={
          <Button color="inherit" onClick={onRetry} size="small">
            Retry
          </Button>
        }
        severity="error"
      >
        {error ?? "Unable to load this content."}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Stack alignItems="center" minHeight={240} px={2} py={6} textAlign="center">
        <InboxOutlinedIcon color="disabled" sx={{ fontSize: 48 }} />
        <Typography component="h2" mt={2} variant="h6">
          {emptyTitle}
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          {emptyDescription}
        </Typography>
      </Stack>
    );
  }

  return children;
}
