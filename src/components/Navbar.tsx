import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar: React.FC = () => {
	const [navbar, setNavbar] = useState(false);

	return (
		<div className='sticky top-0'>
			<nav className='bg-dyna-blue-400 text-white decoration-none flex md:flex-row justify-between items-center py-1 md:py-2 md:px-5'>
				<Link href='https://dynamox.net/'>
					<Image
						id='logo-dynamo'
						src='/assets/logo-dynamox.png'
						alt='Dynamox'
						width={150}
						height={150}
					/>
				</Link>
				<button
					className='p-2 text-gray-700 rounded-md outline-none md:hidden'
					onClick={() => setNavbar(!navbar)}
				>
					{navbar ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-6 h-6 text-white'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-6 h-6 text-white'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M4 6h16M4 12h16M4 18h16'
							/>
						</svg>
					)}
				</button>
				<fieldset
					className={`md:flex gap-8 md:pb-0 md:mt-0 ${
						navbar ? 'flex' : 'hidden'
					}`}
				>
					<Link
						href='https://dynamox.net/dynapredict/'
						className='hover:text-dyna-blue-200'
					>
						DynaPredict
					</Link>

					<Link href='#sensors' className='hover:text-dyna-blue-200'>
						Sensores
					</Link>

					<Link href='#contact' className='hover:text-dyna-blue-200'>
						Contatos
					</Link>
				</fieldset>
			</nav>
		</div>
	);
};

export default Navbar;
