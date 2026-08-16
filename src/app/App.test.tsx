import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DataPage from '@/pages/DataPage';

describe('App', () => {
	it('renders DataPage without crashing', () => {
		render(
			<MemoryRouter>
				<DataPage />
			</MemoryRouter>,
		);
		expect(screen.getByText('DataPage placeholder')).toBeInTheDocument();
	});
});
