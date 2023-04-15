import { useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';

import { api } from '../pages/api/hello';

interface Props {
	isCreating: boolean;
	id?: number;
	name?: string;
	value?: number;
	perishable?: boolean;
	productionDate?: string;
	dueDate?: string;
}

type ProductData = {
	name: string;
	value: number;
	perishable: boolean;
	productionDate: string;
	dueDate?: string;
};

const CreateProduct: React.FC<Props> = ({
	isCreating,
	id,
	name,
	value,
	perishable,
	productionDate,
	dueDate,
}) => {
	const [isPerishable, setIsPerishable] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { mutate: createProduct, isLoading } = useMutation(
		(formData: ProductData) =>
			api.post('/products', {
				name: formData.name,
				value: formData.value,
				perishable: formData.perishable,
				productionDate: formData.productionDate,
				dueDate: formData.dueDate,
			}),
		{
			onSuccess: (response: AxiosResponse) => {
				console.log(response.data);
				alert('Sucesso! Produto criado');
			},
			onError: (error: AxiosError) => {
				console.log(error);
			},
		}
	);

	const { mutate: updateProduct } = useMutation(
		(formData: ProductData) =>
			api.put(`/products/${id}`, {
				name: formData.name,
				value: formData.value,
				dueDate: formData.dueDate,
				perishable: formData.perishable,
				productionDate: formData.productionDate,
			}),
		{
			onSuccess: (response: AxiosResponse) => {
				console.log(response.data);
				alert('Sucesso! Produto atualizado');
			},
			onError: (error: AxiosError) => {
				console.log(error);
			},
		}
	);

	const onSubmit = (data: any) => {
		data.value = +data.value;
		if (data.perishable) {
			data.dueDate = null;
		}
		if (isCreating) {
			createProduct(data);
		} else {
			updateProduct(data);
		}
	};
	return (
		<Dialog.Content className='DialogContent bg-slate-950 text-white flex flex-col items-center w-1/2 rounded-md p-5'>
			<Dialog.Title className='font-bold text-xl flex w-full justify-between px-10'>
				<h1>{isCreating ? 'Criar Novo Produto' : 'Editar Produto'}</h1>
				<Dialog.Close>
					<BsXLg className='hover:text-pink-600' />
				</Dialog.Close>
			</Dialog.Title>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col w-full items-start'
			>
				<label htmlFor='name' className='text-slate-700'>
					Nome
				</label>
				<input
					type='text'
					placeholder='Nome do produto'
					{...register('name', { required: true })}
					className='rounded-sm w-4/5 border-b border-b-slate-700 bg-transparent'
				/>

				<fieldset>
					<Controller
						control={control}
						name='perishable'
						render={({ field: { onChange, value } }) => (
							<>
								<label>
									Sim
									<input
										type='radio'
										onChange={() => {
											onChange(true);
											setIsPerishable(true);
										}}
										checked={value === true}
									/>
								</label>
								<label>
									Não
									<input
										type='radio'
										onChange={() => {
											onChange(false);
											setIsPerishable(false);
										}}
										checked={value === false}
									/>
								</label>
							</>
						)}
					/>
					<legend className='text-slate-700'>Perecível</legend>
				</fieldset>

				<div className='flex gap-2 w-full flex-wrap'>
					<label htmlFor='dueDate' className='text-slate-700'>
						Validade
					</label>
					<input
						type='text'
						id='dueDate'
						disabled={isPerishable}
						className='rounded-sm bg-transparent border-b border-b-slate-700 w-fit'
						{...register('dueDate', { required: true })}
					/>

					<label htmlFor='productionDate' className='text-slate-700'>
						Fabricação
					</label>
					<input
						type='text'
						id='productionDate'
						className='rounded-sm bg-transparent border-b border-b-slate-700 w-fit'
						{...register('productionDate', { required: true })}
					/>
				</div>

				<label htmlFor='value' className='text-slate-700'>
					Preço
				</label>
				<input
					type='number'
					step={0.01}
					className='bg-transparent border-b border-b-slate-700'
					placeholder='0,00'
					{...register('value', { required: true })}
				/>
				<button
					type='submit'
					disabled={isLoading}
					className='bg-pink-600 m-2 px-3 py-2 hover:bg-pink-700 disabled:bg-slate-950'
				>
					{isCreating ? 'Criar Produto' : 'Editar Produto'}
				</button>
			</form>
		</Dialog.Content>
	);
};

export default CreateProduct;
