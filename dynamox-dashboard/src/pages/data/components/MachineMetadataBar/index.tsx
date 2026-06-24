import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ComponentType, SVGProps } from 'react'

export interface MachineMetadataItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
}

interface MachineMetadataBarProps {
  items: MachineMetadataItem[]
}

export function MachineMetadataBar({ items }: MachineMetadataBarProps) {
  const lastItemIndex = items.length - 1

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: (theme) => theme.border.default,
        borderRadius: 'borderRadius',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(5, 1fr)',
        },
        overflow: 'hidden',
      }}
    >
      {items.map(({ icon: Icon, label }, index) => (
        <Box
          key={`${label}-${index}`}
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              display: {
                xs: index === lastItemIndex ? 'none' : 'block',
                md: index === 0 ? 'none' : 'block',
              },
              width: {
                xs: '100%',
                md: '0.0625rem',
              },
              height: {
                xs: '0.0625rem',
                md: '1.3125rem',
              },
              bgcolor: (theme) => theme.border.default,
              position: 'absolute',
              top: {
                xs: 'auto',
                md: '50%',
              },
              left: 0,
              bottom: {
                xs: 0,
                md: 'auto',
              },
              transform: {
                xs: 'none',
                md: 'translateY(-50%)',
              },
            },
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ padding: '0.78125rem' }}
          >
            <Icon style={{ color: 'currentColor' }} />
            <Typography color="text.primary" variant="body1">
              {label}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Paper>
  )
}
