import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

interface MetricChartCardProps {
	children: ReactNode;
	title: string;
	titleId: string;
}

export function MetricChartCard({ children, title, titleId }: MetricChartCardProps) {
	return (
		<Card component="article" aria-labelledby={titleId} sx={{ overflow: 'hidden', width: '100%' }}>
			<CardHeader
				title={title}
				titleTypographyProps={{ component: 'h2', id: titleId, variant: 'h6' }}
				sx={{ minHeight: 58, px: { xs: 2, sm: 3 } }}
			/>
			<CardContent
				sx={{
					minWidth: 0,
					p: { xs: 2, sm: 3 },
					'&:last-child': { pb: { xs: 2, sm: 3 } },
				}}
			>
				{children}
			</CardContent>
		</Card>
	);
}
