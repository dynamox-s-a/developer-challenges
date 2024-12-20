import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

/**
 * A custom hook that returns the `dispatch` function from the Redux store.
 * This hook is typed with the `AppDispatch` type to ensure type safety when dispatching actions.
 * @returns {AppDispatch} The `dispatch` function from the Redux store.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * A custom hook that returns the `useSelector` hook from the Redux store.
 * This hook is typed with the `RootState` type to ensure type safety when selecting state.
 * @type {TypedUseSelectorHook<RootState>} The `useSelector` hook typed with the `RootState` type.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

