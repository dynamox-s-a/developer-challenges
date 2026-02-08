import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/store/auth/auth.api';
import { logout, selectUser, setUser } from '@/store/auth/auth.slice';
import type { AuthState } from '@/store/auth/auth.slice';

export function AuthInitializer({ children }: { children: React.ReactNode }): React.JSX.Element {
  debugger;
  const dispatch = useDispatch();
  const token = useSelector((state: { auth: AuthState }) => state.auth.token);
  const user = useSelector(selectUser);

  const { data: userData, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token || !!user, // Skip if no token or if user is already loaded
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    if (userData && !user) {
      dispatch(setUser(userData));
    }

    if (error) {
      // If token is invalid or expired, log out
      dispatch(logout());
    }
  }, [token, userData, user, error, dispatch]);

  if (token && !user && isLoading) {
    // Optional: Render a loading spinner while fetching user data
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
