import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MenuItem } from 'routes/sitemap';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapseListItem = ({ subheader, active: propActive, items, icon }: MenuItem) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isChildActive = items?.some((item) => location.pathname === item.path);
  const active = propActive || isChildActive;

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ pb: 1.5 }}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {icon && (
            <IconifyIcon
              icon={icon}
              sx={{
                color: active ? 'primary.main' : null,
              }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={subheader}
          sx={{
            '& .MuiListItemText-primary': {
              color: active ? 'primary.main' : null,
              fontWeight: active ? 600 : 500,
            },
          }}
        />
        <IconifyIcon
          icon="iconamoon:arrow-down-2-duotone"
          sx={{
            color: active ? 'primary.main' : 'text.disabled',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items?.map((route) => {
            const isItemActive = location.pathname === route.path;
            return (
              <ListItemButton
                key={route.pathName}
                component={Link}
                to={route.path}
                sx={{
                  ml: 2.25,
                  bgcolor: isItemActive ? 'neutral.main' : null,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <ListItemText
                  primary={route.pathName}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isItemActive ? 'primary.main' : 'text.disabled',
                      fontWeight: isItemActive ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

export default CollapseListItem;
