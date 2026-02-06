"use client"

import { Box, Button, TextField, Typography } from "@mui/material"

export const customBox = {
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    border: "2px solid grey"
}

export default function LoginComponent() {
  return (
      <Box 
        component="form" 
        height={500}
        width={400}
        display={'flex'}
        my={4}
        alignItems={"center"}
        sx={customBox}
        >
        <Typography variant="h5" component="div" sx={{mb: 2}}>
          Sign In
        </Typography>
        <TextField 
          name="name"
          label="Name"
          variant="outlined"
          sx={{
            mb: 2
          }}
        />
        <TextField 
          name="email"
          label="Email"
          variant="outlined"
          sx={{
            mb: 2
          }}
        />
        <TextField 
          name="password"
          label="Password"
          variant="outlined"
          type="password"
          sx={{
            mb: 2
          }}
        />
        <Button
          variant="contained"
        >
          Submit
        </Button>
      </Box>
  )
}