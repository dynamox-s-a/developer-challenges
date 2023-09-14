import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'

export interface DataCardProps {
  title: string
  amount: string | number
  caption: string
  icon: React.ReactNode
  progress: React.ReactNode
}

export function DataCard({ title, amount, caption, icon, progress }: DataCardProps) {
  return (
    <Card key={title} sx={{ marginBottom: 3 }}>
      <CardContent sx={{ padding: 3 }}>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h4">{amount}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 48,
              width: 48
            }}
          >
            <SvgIcon>{icon}</SvgIcon>
          </Avatar>
        </Stack>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="caption">{caption}</Typography>
          {progress}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Card
