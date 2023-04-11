import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Raleway } from 'next/font/google';
import { SubmitHandler, useForm } from 'react-hook-form';

import Navbar from '@/components/Navbar';
const raleway = Raleway({ subsets: ['latin'] });

interface FormData {
	username: string;
	company: string;
	email: string;
	phone: string;
}

export default function Home() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = (data: FormData) =>
		alert(
			`Username: ${data.username}, Company: ${data.company}, Email: ${data.email}, Phone: ${data.phone}`
		);

	return (
		<>
			<Head>
				<title>Dynamox</title>
			</Head>
			<main className={raleway.className}>
				<Navbar></Navbar>
				<section className='bg-dyna-texture w-screen h-screen bg-no-repeat bg-center bg-cover flex items-center flex-col py-5 md:flex-row md:p-20'>
					<div className='md:w-1/2 p-10 flex flex-col gap-10'>
						<h1 className='text-4xl md:text-7xl font-bold text-white'>
							Solução DynaPredict
						</h1>
						<Image
							id='logo-dyna-predict'
							src='/assets/logo-dynapredict.png'
							alt='Sensor TCA'
							width={200}
							height={200}
							className=''
						/>
					</div>
					<div className='flex'>
						<Image
							id='desktop-mobile'
							src='/assets/desktop-and-mobile.png'
							alt='Desktop e Mobile'
							width={900}
							height={900}
						/>
					</div>
				</section>
				<section
					id='sensors'
					className='flex flex-col items-center h-fit bg-dyna-blue-100 gap-10 p-10 md:p-20'
				>
					<div className='flex flex-col items-center text-center gap-5'>
						<h1 className='font-bold text-2xl md:text-4xl text-dyna-gray-200'>
							Sensores para Manutenção Preditiva
						</h1>
						<article className='text-xl md:text-2xl text-dyna-gray-100'>
							Opções de sensores sem fio, ou DynaLoggers com sensores de
							vibração triaxial e temperatura embarcados, que comunicam por
							Bluetooth com o App mobile ou Gateway, registrando os dados
							monitorados em sua memória interna. Por conexão internet esses
							dados são centralizados na Plataforma DynaPredict Web para
							análise, prognóstico e tomada de decisão.
						</article>
						<Link
							href='https://dynamox.net/dynapredict/'
							className='bg-dyna-blue-400 text-white font-bold py-2 px-8 uppercase text-xl rounded-sm'
						>
							Ver mais
						</Link>
					</div>
					<div className='flex md:gap-20'>
						<fieldset className='flex flex-col items-center'>
							<Image
								id='sensor-tca'
								src='/assets/sensor-tca.png'
								alt='Sensor TCA'
								width={300}
								height={300}
							/>
							<label
								htmlFor='sensor-tca'
								className='font-bold text-dyna-blue-200 text-4xl'
							>
								TcA+
							</label>
						</fieldset>
						<fieldset className='flex flex-col items-center'>
							<Image
								id='sensor-as'
								src='/assets/sensor-as.png'
								alt='Sensor AS'
								width={300}
								height={300}
							/>
							<label
								htmlFor='sensor-as'
								className='font-bold text-dyna-blue-200 text-4xl'
							>
								AS
							</label>
						</fieldset>
						<fieldset className='flex flex-col items-center'>
							<Image
								id='sensor-hf'
								src='/assets/sensor-hf.png'
								alt='Sensor HF'
								width={300}
								height={300}
							/>
							<label
								htmlFor='sensor-hf'
								className='font-bold text-dyna-blue-200 text-4xl'
							>
								HF
							</label>
						</fieldset>
					</div>
				</section>
				<footer
					id='contact'
					className='bg-dyna-blue-400 flex flex-col p-10 items-center'
				>
					<h1 className='text-3xl font-bold text-white'>Ficou com dúvida?</h1>
					<h1 className='text-3xl font-bold text-white'>
						Nós entramos em contato com você
					</h1>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col w-full items-center gap-3 m-5'
					>
						<input
							type='text'
							id='username'
							placeholder='Como gostaria de ser chamado?'
							className='md:w-2/5 rounded-md p-2'
							{...register('username', { required: true })}
						/>
						{errors.username && (
							<span className='text-red-400'>Esse campo é obrigatório</span>
						)}
						<input
							type='text'
							id='company'
							placeholder='Em qual empresa você trabalha?'
							className='md:w-2/5 rounded-md p-2'
							{...register('company', { required: true })}
						/>
						{errors.company && (
							<span className='text-red-400'>Esse campo é obrigatório</span>
						)}
						<input
							type='email'
							id='email'
							placeholder='Digite aqui seu email'
							className='md:w-2/5 rounded-md p-2'
							{...register('email', { required: true })}
						/>
						{errors.email && (
							<span className='text-red-400'>Esse campo é obrigatório</span>
						)}
						<input
							type='text'
							id='phone'
							placeholder='Qual o seu telefone?'
							className='md:w-2/5 rounded-md p-2'
							{...register('phone', { required: true })}
						/>
						{errors.phone && (
							<span className='text-red-400'>Esse campo é obrigatório</span>
						)}
						<button
							type='submit'
							className='uppercase text-white bg-dyna-blue-300 py-2 px-10 rounded-md font-bold'
						>
							Enviar
						</button>
					</form>
				</footer>
			</main>
		</>
	);
}

