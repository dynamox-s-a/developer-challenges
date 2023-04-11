/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'dyna-blue': {
					100: '#F4F7FC',
					200: '#5D7A8C',
					300: '#0165DB',
					400: '#263252',
				},
				'dyna-gray': {
					100: '#454545',
					200: '#37383D',
				},
			},
			backgroundImage: { 'dyna-texture': "url('/assets/grafismo.png')" },
		},
	},
	plugins: [],
};

