import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** `useDispatch` that knows about thunks. Always use this instead of the raw hook. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** `useSelector` bound to `RootState`. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
