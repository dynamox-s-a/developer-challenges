import { Box, Card } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType } from "react";
import {
  AccessTime,
  GpsFixed,
  MonitorHeart,
  PrecisionManufacturing,
  Speed,
} from "@mui/icons-material";
import type { MachineDto } from "../../features/data/types";

type MachineInfoBarProps = {
  machine: MachineDto;
};

type Item = {
  key: keyof MachineDto;
  label: string;
  Icon: ElementType;
};

const ITEMS: Item[] = [
  { key: "name", label: "Máquina", Icon: PrecisionManufacturing },
  { key: "point", label: "Ponto", Icon: GpsFixed },
  { key: "sampleRate", label: "Taxa de amostragem", Icon: Speed },
  { key: "range", label: "Faixa", Icon: MonitorHeart },
  { key: "interval", label: "Intervalo", Icon: AccessTime },
];

function MachineInfoBar({ machine }: MachineInfoBarProps) {
  return (
    <Card component="ul" sx={styles.bar}>
      {ITEMS.map(({ key, label, Icon }) => (
        <Box component="li" key={key} sx={styles.item}>
          <Icon fontSize="small" titleAccess={label} />
          <span>{machine[key]}</span>
        </Box>
      ))}
    </Card>
  );
}

const styles = {
  bar: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    m: 0,
    p: 0,
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    flex: "1 1 auto",
    px: 2,
    py: 1.5,
    borderLeft: { xs: 0, md: 1 },
    borderColor: "divider",
    "&:first-of-type": { borderLeft: 0 },
  },
} satisfies Record<string, SxProps<Theme>>;

export default MachineInfoBar;
