import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<title>Dynamox</title>
				<meta name='description' content='Cadastre os melhores produtos...' />
				<link
					rel='icon'
					sizes='16x16'
					href='/logo-small.png'
					type='image/png'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

