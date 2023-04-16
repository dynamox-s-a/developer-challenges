import * as Dialog from '@radix-ui/react-dialog';
import { useProducts } from '@/hooks/useProducts';
import CreateProduct from '@/components/CreateProduct';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '@/pages/api/hello';
import { useState } from 'react';

const Products: React.FC = () => {
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useProducts();

	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * pageSize;
	const productsToShow = data.slice(startIndex, startIndex + pageSize);

	const pageCount = Math.ceil(data.length / pageSize);

	function goToPreviousPage() {
		setCurrentPage(currentPage - 1);
	}

	function goToNextPage() {
		setCurrentPage(currentPage + 1);
	}

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
		<div className='flex flex-col h-fit w-screen bg-slate-900 text-white'>
			<Dialog.Root>
				<Dialog.Trigger className='bg-pink-700 hover:bg-pink-800 w-fit h-fit p-3'>
					Criar Novo Produto
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className='DialogOverlay backdrop-blur-lg' />
					<CreateProduct isCreating={true}></CreateProduct>
				</Dialog.Portal>
			</Dialog.Root>
			<section>
				<h1 className='font-bold text-xl'>Meus Produtos</h1>
				<div>
					{productsToShow.map((product: any) => {
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
								<Dialog.Root>
									<Dialog.Trigger className='bg-pink-700 hover:bg-pink-800 w-fit h-fit p-3'>
										Editar Produto
									</Dialog.Trigger>
									<Dialog.Portal>
										<Dialog.Overlay className='DialogOverlay backdrop-blur-lg' />
										<CreateProduct
											isCreating={false}
											id={product.id}
										></CreateProduct>
									</Dialog.Portal>
								</Dialog.Root>
							</div>
						);
					})}
					<div>
						{currentPage > 1 && (
							<button onClick={goToPreviousPage}>Previous Page</button>
						)}
						{currentPage < pageCount && (
							<button onClick={goToNextPage}>Next Page</button>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Products;
