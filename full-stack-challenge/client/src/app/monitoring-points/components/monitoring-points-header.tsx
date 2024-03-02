import HelpIcon from '@mui/icons-material/Help';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { MonitoringPointsTabsType } from './monitoring-points-content';

interface HeaderProps {
  onDrawerToggle?: () => void;
}

export default function MonitoringPointsHeader(
  props: {
    selectTab: (tab: MonitoringPointsTabsType) => void;
    selectedTab: MonitoringPointsTabsType;
  } & HeaderProps
) {
  const handleChange = (event: any) => {
    props.selectTab(event?.target.outerText);
  };

  return (
    <React.Fragment>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Monitoring Point Management
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton href="mailto:dpo@dynamox.net" color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Tabs value={props.selectedTab} textColor="inherit">
          <Tab onClick={handleChange} value={'List'} label="List" />
          <Tab onClick={handleChange} value={'Manage'} label="Manage" />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}
