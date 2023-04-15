import { api } from '@/pages/api/hello';
import { useQuery } from 'react-query';

export const useProducts = () => {
	return useQuery('products', async () => {
		const { data } = await api.get('/products');
		return data;
	});
};
