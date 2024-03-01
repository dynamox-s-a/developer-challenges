/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from 'next-auth/react';
import { FC, useEffect, ReactNode } from 'react';
import { NextRouter, useRouter } from 'next/router';
import useAppSelector from '../hooks/useAppSelector';
import LoadingContent from '../components/LoadingContent';

const privateRoute = (WrappedComponent: FC): FC<ReactNode> => {
	const Wrapper: FC<ReactNode> = (props: any): JSX.Element => {
		const router: NextRouter = useRouter();
    const { status } = useSession();
    const { user } = useAppSelector(state => state.user);

    useEffect(() => {
      if (status === 'unauthenticated' || !user || !Object.keys(user).includes('id')) {
        router.push('/auth/login');
      }
    }, [status, router, user]);

		return (
			<>
				{
					(user && status === 'authenticated')
						? <WrappedComponent {...props}/>
						: <LoadingContent />
				}
			</>
		)
	};

	return Wrapper;
};

export default privateRoute;
