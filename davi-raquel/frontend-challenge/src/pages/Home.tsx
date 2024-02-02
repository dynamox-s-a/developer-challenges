import { PageContainer } from "../components/PageContainer"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <PageContainer>
      <Box
        sx={{
          marginTop: "2em",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Button
          component={Link}
          to={"/data"}
          sx={{
            bgcolor: "white",
            "&:hover": {
              backgroundColor: "gray",
            },
          }}
        >
          LOGIN
        </Button>
      </Box>
    </PageContainer>
  )
}
