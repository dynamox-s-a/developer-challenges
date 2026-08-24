import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { resolveDefaultExport } from '@/lib/resolveDefaultExport';

const InfoOutlined = resolveDefaultExport(InfoOutlinedIcon);

interface EmptyStateProps {
	message?: string;
}

export function EmptyState({ message = 'Nenhuma medição disponível.' }: EmptyStateProps) {
	return (
		<Box
			role="status"
			aria-atomic="true"
			aria-live="polite"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: 300,
				gap: 2,
			}}
		>
			<InfoOutlined color="info" sx={{ fontSize: 48 }} />
			<Typography variant="body1">{message}</Typography>
		</Box>
	);
}
