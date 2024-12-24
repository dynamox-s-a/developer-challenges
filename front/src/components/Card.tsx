import {
  Card as MuiCard,
  Box
} from "@mui/material"
import { ReactNode } from "react"

export const Card = ({ 
  onSubmit, 
  children }: { 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, 
  children: ReactNode 
}) => {

  return (
    <MuiCard 
      variant="outlined"
      sx={{
        maxWidth: 500,
        width: '100%',
        padding: 3
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2
        }}
      >
        {children}
      </Box>
    </MuiCard>
  )
}
