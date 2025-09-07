import { Card, CardContent, Stack, Typography } from "@mui/material";
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

export default function MachineHeader() {
  const acc = useSelector(selectAcceleration);
  const vel = useSelector(selectVelocity);
  const tmp = useSelector(selectTemperature);

  const anySeries = acc[0]?.points ?? vel[0]?.points ?? tmp[0]?.points ?? [];
  const [from, to] = firstLastEpoch(anySeries);

  const fmt = (ms: number | null) =>
    ms
      ? new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(ms)
      : "—";

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Dados da Máquina
        </Typography>
        <Stack direction="row" spacing={3}>
          <Typography variant="body2">
            Intervalo: <strong>{fmt(from)}</strong> → <strong>{fmt(to)}</strong>
          </Typography>
          <Typography variant="body2">
            Aceleração: <strong>{acc.length}</strong> séries
          </Typography>
          <Typography variant="body2">
            Velocidade: <strong>{vel.length}</strong> séries
          </Typography>
          <Typography variant="body2">
            Temperatura: <strong>{tmp.length}</strong> série(s)
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
