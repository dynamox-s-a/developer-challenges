import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { X as XIcon } from '@phosphor-icons/react';
import Box from '@mui/material/Box';

export interface ModalLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export function ModalLayout({ children, onClose, open, title, maxWidth = 'sm' }: ModalLayoutProps): React.JSX.Element {
  return (
    <Dialog maxWidth={maxWidth} onClose={onClose} open={open} fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          <IconButton onClick={onClose} size="small">
            <XIcon fontSize="var(--icon-fontSize-md)" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
