import { Box, BoxProps, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const StyledBox = styled(Box)<BoxProps>({ background: '#ffffff', flex: 1 })

export interface NoRegisterProps {
  item: 'machine' | 'spot'
}

export function NoRegister({ item }: NoRegisterProps) {
  const pathname = usePathname()

  return (
    <StyledBox>
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
    </StyledBox>
  )
}

export default NoRegister
