import { Container, Typography } from "@mui/material";
import { useCurrentYear } from "../../hooks/useCurrentYear";

export function Footer(){
  const { currentYear } = useCurrentYear()

  return (
    <footer>
      <Container>
        <Typography sx={{ padding: '64px 0px 32px 0px' }} variant="subtitle1" color={'primary.light'} >
          &copy; {currentYear} Dynamox. All rights reserverd.
        </Typography>
      </Container>
    </footer>
  )
}