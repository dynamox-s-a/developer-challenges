import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

/**
 * The API's message, with the reasons that belong to no form field listed under it, such
 * as every point that blocks a machine type change. Nothing refused is left unexplained.
 */
export function FailureAlert({ message, reasons = [] }: { message: string; reasons?: string[] }) {
  return (
    <Alert severity="error" sx={{ mb: 1 }}>
      <Box component="p" sx={{ m: 0 }}>
        {message}
      </Box>
      {reasons.length > 0 && (
        <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5 }}>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </Box>
      )}
    </Alert>
  );
}
