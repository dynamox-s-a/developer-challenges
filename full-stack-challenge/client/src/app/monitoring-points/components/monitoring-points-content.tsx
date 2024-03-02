import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { Match, Switch } from '../../core/components/switch';
import { Copyright } from '../../page';
import MonitoringPointsCreationForm from './monitoring-points-creation-form';
import MonitoringPointsHeader from './monitoring-points-header';
import MonitoringPointsTable from './monitoring-points-table';

export interface MonitoringPointsContentProps {
  onDrawerToggle?: () => void;
}
export type MonitoringPointsTabsType = 'List' | 'Manage';

const MonitoringPointsContent: React.FC<MonitoringPointsContentProps> = () => {
  const [tab, setTab] = React.useState<MonitoringPointsTabsType>('List');
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <MonitoringPointsHeader
        selectTab={(tab) => setTab(tab)}
        selectedTab={tab}
      />
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
        <Switch>
          <Match when={tab === 'List'}>
            <MonitoringPointsTable />
          </Match>
          <Match when={tab === 'Manage'}>
            <Stack sx={{ gap: 2 }}>
              <MonitoringPointsCreationForm />
            </Stack>
          </Match>
        </Switch>
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default MonitoringPointsContent;
