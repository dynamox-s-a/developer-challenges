import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message = 'Carregando dados...' }: LoadingStateProps) {
	return (
		<Box
			role="status"
			aria-label={message}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: 300,
				gap: 2,
			}}
		>
			<CircularProgress />
			<Typography variant="body1">{message}</Typography>
		</Box>
	);
}
