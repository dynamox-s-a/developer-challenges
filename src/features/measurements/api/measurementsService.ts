import { httpClient } from '@/lib/httpClient';
import type { MeasurementsApiResponse } from './types';

export async function getAll(): Promise<MeasurementsApiResponse> {
	const { data } = await httpClient.get<MeasurementsApiResponse>('/measurements');
	return data;
}
