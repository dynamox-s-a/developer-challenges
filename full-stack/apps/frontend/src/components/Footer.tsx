import { Box, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[50],
        borderTop: `1px solid ${theme.palette.divider}`,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Desenvolvido com{' '}
        <span style={{ color: theme.palette.error.main }}>❤️</span>
        {' '}por Júlio César de Amorim
        {' '}
        © {currentYear}
      </Typography>
      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1, display: 'block' }}>
        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
          Full Stack Challenge - Dynamox
        </Link>
      </Typography>
    </Box>
  );
}
