import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectAcceleration,
  selectVelocity,
  selectTemperature,
} from "@/domain/data/selectors";

function firstLastEpoch(points: [number, number][]) {
  if (!points?.length) return [null, null] as const;
  return [points[0][0], points[points.length - 1][0]] as const;
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export default function MachineHeader() {
  const acc = useSelector(selectAcceleration);
  const vel = useSelector(selectVelocity);
  const tmp = useSelector(selectTemperature);

  const anySeries = acc[0]?.points ?? vel[0]?.points ?? tmp[0]?.points ?? [];
  const [from, to] = firstLastEpoch(anySeries);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (ms: number | null) =>
    ms
      ? new Intl.DateTimeFormat("pt-BR", {
          dateStyle: isXs ? "short" : "medium",
          timeStyle: isXs ? "short" : "short",
        }).format(ms)
      : "—";

  const chipsSx = {
    bgcolor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.12)",
    color: "inherit",
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid",
        borderColor: "rgba(255,255,255,0.12)",
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ py: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Dados da Máquina
          </Typography>
        </Stack>

        <Divider
          sx={{
            my: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="center"
        >
          <Chip
            label={
              <Box component="span">
                <strong>Intervalo:</strong> {formatDate(from)} &rarr;{" "}
                {formatDate(to)}
              </Box>
            }
            size="small"
            variant="outlined"
            sx={chipsSx}
          />
          <Chip
            label={
              <Box component="span">
                <strong>Aceleração:</strong> {acc.length}{" "}
                {pluralize(acc.length, "série", "séries")}
              </Box>
            }
            size="small"
            variant="outlined"
            sx={chipsSx}
          />
          <Chip
            label={
              <Box component="span">
                <strong>Velocidade:</strong> {vel.length}{" "}
                {pluralize(vel.length, "série", "séries")}
              </Box>
            }
            size="small"
            variant="outlined"
            sx={chipsSx}
          />
          <Chip
            label={
              <Box component="span">
                <strong>Temperatura:</strong> {tmp.length}{" "}
                {pluralize(tmp.length, "série", "séries")}
              </Box>
            }
            size="small"
            variant="outlined"
            sx={chipsSx}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
