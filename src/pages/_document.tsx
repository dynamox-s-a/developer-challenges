import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='pt-BR'>
			<Head>
				<meta name='description' content='Sensores para manutenção preditiva' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/assets/logo-small.png' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

