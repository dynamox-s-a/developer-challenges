import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import type { ReactNode } from 'react';
import { AcquisitionIntervalIcon } from '@/components/icons/AcquisitionIntervalIcon';
import { MachineIcon } from '@/components/icons/MachineIcon';
import { MeasurementRangeIcon } from '@/components/icons/MeasurementRangeIcon';
import { RpmIcon } from '@/components/icons/RpmIcon';
import { resolveDefaultExport } from '@/lib/resolveDefaultExport';
import type { MachineInfo } from '@/features/measurements/constants';

const GpsFixed = resolveDefaultExport(GpsFixedIcon);

interface MachineSummaryProps {
	data: MachineInfo;
}

interface SummaryItem {
	accessibleValue: string;
	icon: ReactNode;
	label: string;
}

const visuallyHidden = {
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: 1,
	margin: -1,
	overflow: 'hidden',
	p: 0,
	position: 'absolute',
	whiteSpace: 'nowrap',
	width: 1,
} as const;

export function MachineSummary({ data }: MachineSummaryProps) {
	const items: SummaryItem[] = [
		{
			accessibleValue: data.machineId,
			icon: (
				<MachineIcon
					aria-label="Máquina"
					role="img"
					sx={{ fontSize: 20 }}
					titleAccess="Máquina"
					viewBox="0 0 20 20"
				/>
			),
			label: `Máquina ${data.machineId}`,
		},
		{
			accessibleValue: data.pointId,
			icon: (
				<GpsFixed
					aria-label="Ponto de monitoramento"
					role="img"
					titleAccess="Ponto de monitoramento"
					sx={{ fontSize: 20 }}
				/>
			),
			label: `Ponto ${data.pointId}`,
		},
		{
			accessibleValue: `${data.rpm} RPM`,
			icon: (
				<RpmIcon
					aria-label="Rotação"
					role="img"
					sx={{ fontSize: 20 }}
					titleAccess="Rotação"
					viewBox="0 0 20 20"
				/>
			),
			label: `${data.rpm}`,
		},
		{
			accessibleValue: data.range,
			icon: (
				<MeasurementRangeIcon
					aria-label="Faixa de medição"
					role="img"
					sx={{ fontSize: 20 }}
					titleAccess="Faixa de medição"
					viewBox="0 0 20 20"
				/>
			),
			label: data.range,
		},
		{
			accessibleValue: data.acquisitionInterval,
			icon: (
				<AcquisitionIntervalIcon
					aria-label="Intervalo de aquisição"
					role="img"
					sx={{ fontSize: 20 }}
					titleAccess="Intervalo de aquisição"
					viewBox="0 0 20 20"
				/>
			),
			label: data.acquisitionInterval,
		},
	];

	return (
		<Paper
			component="section"
			aria-label="Resumo da máquina"
			variant="outlined"
			sx={{ mb: 3, minHeight: 46 }}
		>
			<Box
				component="ul"
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: '25% 25% 15.61% 17.22% 17.17%',
					},
					listStyle: 'none',
					m: 0,
					minHeight: 44,
					p: 0,
				}}
			>
				{items.map((item, index) => (
					<Box
						component="li"
						key={item.label}
						sx={{
							alignItems: 'center',
							display: 'flex',
							gap: 1,
							justifyContent: 'center',
							minHeight: 44,
							position: 'relative',
							...(index > 0 && {
								'&::before': {
									backgroundColor: 'divider',
									content: '""',
									height: { xs: '1px', sm: 20 },
									left: { xs: '16px', sm: 0 },
									position: 'absolute',
									right: { xs: '16px', sm: 'auto' },
									top: { xs: 0, sm: 12 },
									width: { xs: 'auto', sm: '1px' },
								},
							}),
						}}
					>
						<Box sx={{ display: 'flex' }}>{item.icon}</Box>
						<Typography aria-hidden="true" variant="body1">
							{item.label}
						</Typography>
						<Typography component="span" sx={visuallyHidden}>
							{item.accessibleValue}
						</Typography>
					</Box>
				))}
			</Box>
		</Paper>
	);
}
