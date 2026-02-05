import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Ao invés de usar 'useDispatch' e 'useSelector' direto do 'react-redux',
// você vai usar esses dois carinhas aqui embaixo na sua aplicação inteira.

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;