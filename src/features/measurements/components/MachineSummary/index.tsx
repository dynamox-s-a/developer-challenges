import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
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
		<Paper variant="outlined" sx={{ mb: 3, minHeight: 46, px: 2 }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 1,
					minHeight: 44,
				}}
			>
				{items.map((item, index) => (
					<Box key={item.label} sx={{ display: 'contents' }}>
						{index > 0 && (
							<Divider
								orientation="vertical"
								flexItem
								sx={{ display: { xs: 'none', sm: 'block' } }}
							/>
						)}
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
							{item.icon}
							<Typography variant="body1">{item.label}</Typography>
						</Box>
					</Box>
				))}
			</Box>
		</Paper>
	);
}
