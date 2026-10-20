import { Box, Card, Typography, type SxProps, type Theme } from "@mui/material";
import { type ReactNode, useId } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

function ChartCard(props: ChartCardProps) {
  const titleId = useId();
  const { title, children } = props;

  return (
    <Card component="section" aria-labelledby={titleId}>
      <Box sx={styles.header}>
        <Typography id={titleId} variant="subtitle2" component="h2">
          {title}
        </Typography>
      </Box>
      <Box sx={styles.body}>{children}</Box>
    </Card>
  );
}

export default ChartCard;

const styles = {
  header: {
    px: 2,
    py: 1.5,
    borderBottom: 1,
    borderColor: "divider",
  },
  body: {
    p: 2,
  },
} satisfies Record<string, SxProps<Theme>>;
