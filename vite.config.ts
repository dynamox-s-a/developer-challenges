/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'highcharts',
							test: /node_modules\/(?:highcharts|highcharts-react-official)\//,
						},
						{
							name: 'mui',
							test: /node_modules\/(?:@emotion|@mui)\//,
						},
						{
							name: 'react',
							test: /node_modules\/(?:react|react-dom|react-redux|react-router|react-router-dom|scheduler)\//,
						},
					],
				},
			},
		},
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@': `${import.meta.dirname}/src`,
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			exclude: ['node_modules/', 'src/test/'],
		},
	},
});
