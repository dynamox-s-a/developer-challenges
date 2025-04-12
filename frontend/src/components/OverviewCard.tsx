import { Card, CardContent, Typography } from "@mui/material";

interface OverviewCardProps {
  title: string;
  value: number;
  color: string;
}

export default function OverviewCard({ title, value, color }: OverviewCardProps) {
  return (
    <Card sx={{ bgcolor: color }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}