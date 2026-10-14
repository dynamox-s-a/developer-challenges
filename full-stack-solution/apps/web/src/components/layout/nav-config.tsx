import type { ReactNode } from "react";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { paths } from "@web/routes/paths";

export interface NavItem {
  key: string;
  title: string;
  href: string;
  icon: ReactNode;
}

/** Navigation entries, rendered by both the desktop and the mobile nav. */
export const navItems: NavItem[] = [
  {
    key: "overview",
    title: "Overview",
    href: paths.overview,
    icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
  },
  {
    key: "machines",
    title: "Machines",
    href: paths.machines,
    icon: <PrecisionManufacturingOutlinedIcon fontSize="small" />,
  },
  {
    key: "monitoring-points",
    title: "Monitoring points",
    href: paths.monitoringPoints,
    icon: <SensorsOutlinedIcon fontSize="small" />,
  },
  {
    key: "time-series",
    title: "Time series",
    href: paths.timeSeries,
    icon: <TimelineOutlinedIcon fontSize="small" />,
  },
];
