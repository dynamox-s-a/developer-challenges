import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import type { ReactNode } from 'react';
import { resolveDefaultExport } from '@/lib/resolveDefaultExport';
import type { MachineInfo } from '../../constants';

const GpsFixed = resolveDefaultExport(GpsFixedIcon);

interface MachineSummaryProps {
	data: MachineInfo;
}

interface SummaryItem {
	icon: ReactNode;
	label: string;
}

export function MachineSummary({ data }: MachineSummaryProps) {
	const items: SummaryItem[] = [
		{
			icon: <img src="/assets/icons/machine.svg" alt="" width={20} height={20} />,
			label: `Máquina ${data.machineId}`,
		},
		{ icon: <GpsFixed sx={{ fontSize: 20 }} />, label: `Ponto ${data.pointId}` },
		{
			icon: <img src="/assets/icons/rpm.svg" alt="" width={20} height={20} />,
			label: `${data.rpm}`,
		},
		{
			icon: <img src="/assets/icons/duration.svg" alt="" width={20} height={20} />,
			label: data.range,
		},
		{
			icon: <img src="/assets/icons/timer.svg" alt="" width={20} height={20} />,
			label: data.acquisitionInterval,
		},
	];

	return (
		<Paper variant="outlined" sx={{ mb: 3, minHeight: 46 }}>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: '25% 25% 15.61% 17.22% 17.17%',
					},
					minHeight: 44,
				}}
			>
				{items.map((item, index) => (
					<Box
						key={item.label}
						sx={{
							alignItems: 'center',
							borderTop: { xs: index > 0 ? 1 : 0, sm: 0 },
							display: 'flex',
							gap: 1,
							justifyContent: 'center',
							minHeight: 44,
							position: 'relative',
							...(index > 0 && {
								'&::before': {
									borderLeft: 1,
									borderColor: 'divider',
									content: '""',
									display: { xs: 'none', sm: 'block' },
									height: 20,
									left: 0,
									position: 'absolute',
									top: 12,
								},
							}),
						}}
					>
						{item.icon}
						<Typography variant="body1">{item.label}</Typography>
					</Box>
				))}
			</Box>
		</Paper>
	);
}
