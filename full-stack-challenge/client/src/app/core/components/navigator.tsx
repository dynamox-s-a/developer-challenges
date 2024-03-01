import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useAuthContext } from '../../login/providers/auth-provider';
import { PageContentType } from '../../page';

const categoriesWithCredentials = [
  {
    id: 'Management',
    children: [
      {
        id: 'Authentication' as PageContentType,
        icon: <PeopleIcon />,
      },
      { id: 'Machines' as PageContentType, icon: <SettingsIcon /> },
      {
        id: 'Sensors' as PageContentType,
        icon: <SettingsInputComponentIcon />,
      },
      { id: 'Monitoring points' as PageContentType, icon: <TimerIcon /> },
    ],
  },
];

const categoriesWithoutCredentials = [
  {
    id: 'Management',
    children: [
      {
        id: 'Authentication' as PageContentType,
        icon: <PeopleIcon />,
      },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(
  props: { onSelect: (id: PageContentType) => void } & DrawerProps
) {
  const { isAuthenticated } = useAuthContext();
  const [activeItem, setactiveItem] = React.useState<
    PageContentType | undefined
  >(undefined);
  const { ...other } = props;

  const categories = isAuthenticated
    ? categoriesWithCredentials
    : categoriesWithoutCredentials;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}
        >
          DynaPredict
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#3b1d2a' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  onClick={() => {
                    setactiveItem(childId);
                    props?.onSelect(childId);
                  }}
                  selected={activeItem === childId}
                  sx={item}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
