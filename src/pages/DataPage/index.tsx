import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EmptyState } from '@/components/EmptyState';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { MachineSummary } from '@/features/measurements/components/MachineSummary';
import { MACHINE_INFO } from '@/features/measurements/constants';
import {
	selectAllSeries,
	selectMeasurementsError,
	selectMeasurementsStatus,
} from '@/features/measurements/store/selectors';
import { measurementsRequested } from '@/features/measurements/store/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function DataPage() {
	const dispatch = useAppDispatch();
	const status = useAppSelector(selectMeasurementsStatus);
	const error = useAppSelector(selectMeasurementsError);
	const data = useAppSelector(selectAllSeries);

	useEffect(() => {
		dispatch(measurementsRequested());
	}, [dispatch]);

	const handleRetry = () => dispatch(measurementsRequested());

	function renderContent() {
		switch (status) {
			case 'idle':
			case 'loading':
				return <LoadingState />;
			case 'error':
				return <ErrorState message={error ?? undefined} onRetry={handleRetry} />;
			case 'success':
				if (data.length === 0) return <EmptyState />;
				return <MachineSummary data={MACHINE_INFO} />;
		}
	}

	return (
		<Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
			<Box
				component="header"
				sx={{
					alignItems: 'center',
					backgroundColor: 'background.paper',
					borderBottom: 1,
					borderColor: 'divider',
					display: 'flex',
					height: 64,
					px: 3,
				}}
			>
				<Typography variant="h4" component="h1">
					Análise de Dados
				</Typography>
			</Box>
			<Box component="main" sx={{ p: { xs: 2, sm: 3 } }}>
				<ErrorBoundary>{renderContent()}</ErrorBoundary>
			</Box>
		</Box>
	);
}
