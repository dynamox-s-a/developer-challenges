import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

/**
 * An array of navigation items used in the dashboard layout.
 * Each item contains a key, title, href, and icon.
 * @type {NavItemConfig[]}
 * @property {string} key - Unique identifier for the navigation item.
 * @property {string} title - Display name of the navigation item.
 * @property {string} href - URL path the navigation item links to.
 * @property {string} icon - Icon name associated with the navigation item.
 */
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
    icon: "folder",
  },
  {
    key: "monitoring-points",
    title: "Monitoring Points",
    href: paths.dashboard["monitoring-points"],
    icon: "presentation-chart",
  },
] satisfies NavItemConfig[];
