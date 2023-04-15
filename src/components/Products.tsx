import * as Dialog from '@radix-ui/react-dialog';
import { useProducts } from '@/hooks/useProducts';
import CreateProduct from '@/components/CreateProduct';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '@/pages/api/hello';

const Products: React.FC = () => {
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useProducts();

	const deleteProduct = useMutation(
		(id: number) => api.delete(`/products/${id}`),
		{
			onSuccess: () => {
				console.log('excluido');
				queryClient.refetchQueries('products');
			},
		}
	);

	const handleDelete = (id: number) => {
		deleteProduct.mutate(id);
	};

	if (isLoading) {
		return <div>Loading</div>;
	}
	if (error) {
		return <div>Error</div>;
	}
	return (
		<div className='flex flex-col h-screen w-screen bg-slate-900 text-white'>
			<Dialog.Root>
				<Dialog.Trigger className='bg-pink-700 hover:bg-pink-800 w-fit h-fit p-3'>
					Criar Novo Produto
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className='DialogOverlay backdrop-blur-lg' />
					<CreateProduct></CreateProduct>
				</Dialog.Portal>
			</Dialog.Root>
			<section>
				<h1 className='font-bold text-xl'>Meus Produtos</h1>
				<div>
					{data.map((product: any) => {
						return (
							<div key={product.id}>
								<div className='rounded-sm hover:bg-pink-900'>
									{product.name}
								</div>
								<button
									className='px-3'
									onClick={() => handleDelete(product.id)}
								>
									Excluir
								</button>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
};

export default Products;
