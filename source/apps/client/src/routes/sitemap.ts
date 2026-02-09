import paths, { rootPaths } from './paths';

export interface SubMenuItem {
  subheader: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: number | string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 1,
    subheader: 'Dashboard',
    path: rootPaths.root,
    icon: 'tabler:home',
    active: true,
  },
  {
    id: 2,
    subheader: 'Machines',
    path: paths.machines,
    icon: 'tabler:engine',
  },
  {
    id: 3,
    subheader: 'Monitoring Points',
    path: paths.monitoringPoints,
    icon: 'tabler:current-location',
  },
  {
    id: 4,
    subheader: 'Telemetry',
    path: paths.telemetry,
    icon: 'tabler:database',
  },
];

export default sitemap;
