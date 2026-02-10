import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingStateProps = {
  message?: string;
  size?: "small" | "medium" | "large";
};

export function LoadingState({ message = "Loading...", size = "medium" }: LoadingStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={200}
      gap={2}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
