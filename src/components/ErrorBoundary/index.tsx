import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { resolveDefaultExport } from '@/lib/resolveDefaultExport';

const ErrorOutline = resolveDefaultExport(ErrorOutlineIcon);

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		if (this.props.fallback) {
			return this.props.fallback;
		}

		return (
			<Box
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
				<Typography variant="h6">Algo deu errado</Typography>
				{this.state.error && (
					<Typography variant="body2" color="text.secondary">
						{this.state.error.message}
					</Typography>
				)}
				<Button variant="outlined" onClick={() => window.location.reload()}>
					Recarregar página
				</Button>
			</Box>
		);
	}
}
