import { CircularProgress } from "@mui/material"

export const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    <CircularProgress />
  </div>
)
