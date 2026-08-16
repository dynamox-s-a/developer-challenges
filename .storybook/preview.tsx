import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { Preview } from '@storybook/react-vite';
import { theme } from '@/theme';

const preview: Preview = {
	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Box
					sx={{
						bgcolor: 'background.default',
						minHeight: '100vh',
						p: { xs: 2, sm: 3 },
					}}
				>
					<Story />
				</Box>
			</ThemeProvider>
		),
	],
	parameters: {
		a11y: {
			context: '#storybook-root',
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: 'fullscreen',
		viewport: {
			options: {
				mobile: {
					name: 'Mobile 375px',
					styles: { height: '812px', width: '375px' },
				},
				tablet: {
					name: 'Tablet 768px',
					styles: { height: '1024px', width: '768px' },
				},
			},
		},
	},
};

export default preview;
