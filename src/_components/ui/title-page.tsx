import { Typography } from "@mui/material"
import { ReactNode } from "react"

interface TitlePageProps {
  children: ReactNode
}

export function TitlePage({ children }: TitlePageProps){
  return (
    <Typography sx={{ fontSize: {xs: '2.5rem', md: '4rem'}, fontWeight: 500}}>
      {children}
    </Typography>
  )
}