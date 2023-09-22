import {
  Avatar,
  AvatarProps,
  Card,
  CardContent,
  CardContentProps,
  CardProps,
  Stack,
  StackProps,
  Typography,
  TypographyProps
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)<CardProps>({
  marginBottom: 24
})

const StyledCardContent = styled(CardContent)<CardContentProps>({
  padding: 24
})

const StyledStack = styled(Stack)<StackProps>({
  alignItems: 'flex-start',
  flexDirection: 'row',
  justifyContent: 'space-between'
})

const ProgressWrapper = styled(Stack)<StackProps>({
  marginTop: 16
})

const StyledCardTitle = styled(Typography)<TypographyProps>({
  fontWeight: 600,
  textTransform: 'uppercase'
})

const StyledCardAmount = styled(Typography)<TypographyProps>({
  fontSize: 32,
  fontWeight: 'bold'
})

const StyledAvatarIcon = styled(Avatar)<AvatarProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: 48,
  width: 48
}))

interface DataCardProps {
  title: string
  amount: string | number
  caption: string
  icon: React.ReactNode
  progress: React.ReactNode
}

export function DataCard({ title, amount, caption, icon, progress }: DataCardProps) {
  return (
    <StyledCard key={title}>
      <StyledCardContent>
        <StyledStack>
          <Stack spacing={1}>
            <StyledCardTitle>{title}</StyledCardTitle>
            <StyledCardAmount>{amount}</StyledCardAmount>
          </Stack>
          <StyledAvatarIcon>{icon}</StyledAvatarIcon>
        </StyledStack>
        <ProgressWrapper>
          <Typography variant="caption">{caption}</Typography>
          {progress}
        </ProgressWrapper>
      </StyledCardContent>
    </StyledCard>
  )
}

export default Card
