import { useStore, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = () => useStore<AppStore>();
