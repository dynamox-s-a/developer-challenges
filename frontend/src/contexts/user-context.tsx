"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { logger } from "@/lib/default-logger";
import type { User } from "@/types/user";
import { useAppDispatch } from "@/types/hooks";
import { getMe } from "@/redux/user/thunks";

/**
 * Defines the shape of the UserContext value.
 */
export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

/**
 * UserContext provides the current user, error, loading state, 
 * and the function to check session state.
 */
export const UserContext = React.createContext<UserContextValue | undefined>(
  undefined,
);

export interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the user, error, and loading state to the components that consume the UserContext.
 * @param {UserProviderProps} props - The props for the UserProvider component
 * @returns {React.JSX.Element} - A JSX element that wraps the child components with the UserContext provider
 */
export function UserProvider({
  children,
}: UserProviderProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { user, error, isLoading } = useSelector((state: RootState) => state.auth);

  /**
   * Dispatches the `getMe` action to fetch the current user from the backend.
   * @returns {Promise<void>} - A promise that resolves when the user is fetched
   */
  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      await dispatch(getMe()); 
    } catch (err) {
      logger.error(err);
    }
  }, [dispatch]);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
    });
  }, [checkSession]);

  return (
    <UserContext.Provider value={{ user, error, isLoading, checkSession }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * UserConsumer is a wrapper for `UserContext.Consumer` 
 * that allows child components to consume the context value.
 */
export const UserConsumer = UserContext.Consumer;