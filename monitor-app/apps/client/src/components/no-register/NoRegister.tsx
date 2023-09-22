import { Button, Typography, TypographyProps } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const StyledTypography = styled(Typography)<TypographyProps>({
  padding: 1
})

export interface NoRegisterProps {
  item: 'machine' | 'spot'
}

export function NoRegister({ item }: NoRegisterProps) {
  const pathname = usePathname()

  return (
    <StyledTypography>
      No {item}s registered:{' '}
      <Button
        component={Link}
        href={`${pathname}/create`}
        variant="contained"
        startIcon={<AddIcon />}
      >
        {item}
      </Button>
    </StyledTypography>
  )
}

export default NoRegister
