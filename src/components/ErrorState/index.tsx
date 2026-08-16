import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { resolveDefaultExport } from '@/lib/resolveDefaultExport';

const ErrorOutline = resolveDefaultExport(ErrorOutlineIcon);

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
}

export function ErrorState({
	message = 'Ocorreu um erro ao carregar os dados.',
	onRetry,
}: ErrorStateProps) {
	return (
		<Box
			role="alert"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: 300,
				gap: 2,
			}}
		>
			<ErrorOutline color="error" sx={{ fontSize: 48 }} />
			<Typography variant="body1">{message}</Typography>
			{onRetry && (
				<Button variant="outlined" onClick={onRetry}>
					Tentar novamente
				</Button>
			)}
		</Box>
	);
}
