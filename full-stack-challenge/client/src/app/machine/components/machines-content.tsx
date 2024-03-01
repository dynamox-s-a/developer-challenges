import Box from '@mui/material/Box';
import React from 'react';
import { Match, Switch } from '../../core/components/switch';
import { Copyright } from '../../page';
import MachineCreationForm from './machine-creation-form';
import MachinesHeader from './machines-header';
import MachinesTable from './machines-table';

export interface MachineContentProps {
  onDrawerToggle?: () => void;
}
export type MachineTabsType = 'List' | 'Manage';

const MachinesContent: React.FC<MachineContentProps> = () => {
  const [tab, setTab] = React.useState<MachineTabsType>('List');
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <MachinesHeader selectTab={(tab) => setTab(tab)} selectedTab={tab} />
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
        <Switch>
          <Match when={tab === 'List'}>
            <MachinesTable />
          </Match>
          <Match when={tab === 'Manage'}>
            <MachineCreationForm />
          </Match>
        </Switch>
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default MachinesContent;
