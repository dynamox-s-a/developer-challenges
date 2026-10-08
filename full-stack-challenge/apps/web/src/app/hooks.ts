import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use these instead of the plain hooks so state and thunks are typed.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
