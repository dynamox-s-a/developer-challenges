import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { colorModeToggled } from '../features/ui/uiSlice';

/** Switches between light and dark; the store persists the choice. */
export function ColorModeToggle() {
  const dispatch = useAppDispatch();
  const colorMode = useAppSelector((state) => state.ui.colorMode);
  const label = colorMode === 'dark' ? 'Use light mode' : 'Use dark mode';

  return (
    <Tooltip title={label}>
      <IconButton
        color="inherit"
        aria-label={label}
        onClick={() => dispatch(colorModeToggled())}
        sx={{ width: 44, height: 44 }}
      >
        {colorMode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}
