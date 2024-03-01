/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from 'next-auth/react';
import { FC, useEffect, ReactNode } from 'react';
import { NextRouter, useRouter } from 'next/router';
import useAppSelector from '../hooks/useAppSelector';
import LoadingContent from '../components/LoadingContent';

const redirectAuthPage = (WrappedComponent: FC): FC<ReactNode> => {
	const Wrapper: FC<ReactNode> = (props: any): JSX.Element => {
		const router: NextRouter = useRouter();
    const { status } = useSession();
    const { user } = useAppSelector(state => state.user);

    useEffect(() => {
      if (status === 'authenticated' && user && 'id' in user) {
        router.push('/');
      }
    }, [status, router, user]);

		return (
			<>
				{
					(!user || !Object.keys(user).includes('id') || status === 'unauthenticated')
						? <WrappedComponent {...props}/>
						: <LoadingContent />
				}
			</>
		)
	};

	return Wrapper;
};

export default redirectAuthPage;
