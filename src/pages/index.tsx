import { Inter } from 'next/font/google';
import type { NextPage } from 'next';
import Products from '../components/Products';
import { QueryClient, QueryClientProvider } from 'react-query';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();
const Home: NextPage = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Products></Products>
		</QueryClientProvider>
	);
};

export default Home;

