import { Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NoRegisterProps {
  item: 'machine' | 'spot'
}

export function NoRegister({ item }: NoRegisterProps) {
  const pathname = usePathname()

  return (
    <Typography sx={{ padding: 1 }}>
      No {item}s registered:{' '}
      <Button
        component={Link}
        href={`${pathname}/create`}
        variant="contained"
        startIcon={<AddIcon />}
      >
        {item}
      </Button>
    </Typography>
  )
}

export default NoRegister
