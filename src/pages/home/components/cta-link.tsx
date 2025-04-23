import { Link as MuiLink, Typography, useTheme } from '@mui/material'
import { CMSSectionLink } from '../../../@types/types'

interface CtaLinkProps {
  data: CMSSectionLink
}

export function CtaLink({ data }: CtaLinkProps) {
  const theme = useTheme()

  return (
    <MuiLink
      href={data.href}
      target="_blank"
      underline="hover"
      color="primary"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '68px',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="#F9F9F9" />
        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#E0D8D4" />
        <path d="M23 17H17V23H15V17H9V15H15V9H17V15H23V17Z" fill="#3A3B3F" />
      </svg>

      <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: '20px' }}>
        {data.text}
      </Typography>
    </MuiLink>
  )
}
