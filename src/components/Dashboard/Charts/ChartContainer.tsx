import { Paper, Typography } from "@mui/material";
import { ChartContainerProps } from "./interfaces/ChartContainerProps";

const ChartContainer = ({ title, children }: ChartContainerProps) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #DFE3E8",
      borderRadius: 1,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        borderBottom: "1px solid #DFE3E8",
        p: 2,
        mb: 2
      }}
    >
      {title}
    </Typography>
    <div>{children}</div>
  </Paper>
);

export default ChartContainer;
