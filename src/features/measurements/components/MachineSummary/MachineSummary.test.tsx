import { render, screen } from '@testing-library/react';
import type { MachineInfo } from '../../constants';
import { MachineSummary } from './index';

const mockData: MachineInfo = {
	machineId: '1023',
	pointId: '20192',
	rpm: 200,
	range: '16g',
	acquisitionInterval: '20 min',
};

describe('MachineSummary', () => {
	it('renders all machine info fields', () => {
		render(<MachineSummary data={mockData} />);
		expect(screen.getByText('Máquina 1023')).toBeInTheDocument();
		expect(screen.getByText('Ponto 20192')).toBeInTheDocument();
		expect(screen.getByText('200')).toBeInTheDocument();
		expect(screen.getByText('16g')).toBeInTheDocument();
		expect(screen.getByText('20 min')).toBeInTheDocument();
	});

	it('renders correct values from props', () => {
		const customData: MachineInfo = {
			machineId: '9999',
			pointId: '11111',
			rpm: 500,
			range: '32g',
			acquisitionInterval: '10 min',
		};
		render(<MachineSummary data={customData} />);
		expect(screen.getByText('Máquina 9999')).toBeInTheDocument();
		expect(screen.getByText('500')).toBeInTheDocument();
	});
});
