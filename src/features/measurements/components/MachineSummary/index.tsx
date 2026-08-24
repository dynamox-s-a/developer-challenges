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
	data: Partial<MachineInfo>;
}

interface SummaryItem {
	accessibleValue: string;
	icon: ReactNode;
	id: keyof MachineInfo;
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

function hasText(value: string | undefined): value is string {
	return Boolean(value?.trim());
}

export function MachineSummary({ data }: MachineSummaryProps) {
	const items: SummaryItem[] = [];

	if (hasText(data.machineId)) {
		items.push({
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
			id: 'machineId',
			label: `Máquina ${data.machineId}`,
		});
	}

	if (hasText(data.pointId)) {
		items.push({
			accessibleValue: data.pointId,
			icon: (
				<GpsFixed
					aria-label="Ponto de monitoramento"
					role="img"
					titleAccess="Ponto de monitoramento"
					sx={{ fontSize: 20 }}
				/>
			),
			id: 'pointId',
			label: `Ponto ${data.pointId}`,
		});
	}

	if (data.rpm !== undefined) {
		items.push({
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
			id: 'rpm',
			label: `${data.rpm}`,
		});
	}

	if (hasText(data.range)) {
		items.push({
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
			id: 'range',
			label: data.range,
		});
	}

	if (hasText(data.acquisitionInterval)) {
		items.push({
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
			id: 'acquisitionInterval',
			label: data.acquisitionInterval,
		});
	}

	const desktopColumns =
		items.length === 5
			? '25% 25% 15.61% 17.22% 17.17%'
			: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`;

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
						sm: desktopColumns,
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
						key={item.id}
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
