import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

export const navItems = [
  {
    key: "overview",
    title: "Overview",
    href: paths.dashboard.overview,
    icon: "chart-pie",
  },
  {
    key: "machines",
    title: "Machines",
    href: paths.dashboard.machines,
    icon: "chart-pie",
  },
  {
    key: "monitoring-points",
    title: "Monitoring Points",
    href: paths.dashboard["monitoring-points"],
    icon: "chart-pie",
  },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
