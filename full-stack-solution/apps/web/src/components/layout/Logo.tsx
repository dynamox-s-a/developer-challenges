import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface LogoProps {
  /** `light` for dark backgrounds (the navigation), `dark` for light ones. */
  variant?: "light" | "dark";
}

/**
 * Wordmark used in the navigation and on the login screen.
 *
 * The template ships a bitmap logo; a text mark keeps the bundle free of
 * unlicensed brand assets.
 */
export function Logo({ variant = "light" }: LogoProps) {
  const color = variant === "light" ? "common.white" : "text.primary";

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box
        aria-hidden
        sx={{
          bgcolor: "primary.main",
          borderRadius: "10px",
          height: 32,
          width: 32,
          display: "grid",
          placeItems: "center",
          color: "primary.contrastText",
          fontWeight: 700,
        }}
      >
        D
      </Box>
      <Typography color={color} sx={{ fontWeight: 600 }} variant="h6">
        DynaPredict
      </Typography>
    </Stack>
  );
}
