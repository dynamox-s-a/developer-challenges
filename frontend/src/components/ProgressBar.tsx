import { Box, Typography } from "@mui/material";

interface ProgressBarProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export default function ProgressBar({ label, value, percentage, color }: ProgressBarProps) {
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        {label}
      </Typography>
      <Box
        sx={{
          height: 10,
          bgcolor: "background.default",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${percentage}%`,
            bgcolor: color,
          }}
        />
      </Box>
      <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
        {value} ({percentage}%)
      </Typography>
    </Box>
  );
}