import * as React from "react";

import type { UserContextValue } from "@/contexts/user-context";
import { UserContext } from "@/contexts/user-context";

/**
 * A custom hook that provides access to the current user context.
 * @returns {UserContextValue} The current user context value, including user information, error, loading state, and session management functions.
 */
export function useUser(): UserContextValue {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}