/** biome-ignore-all lint/suspicious/noExplicitAny: idk */
import {
  setTimeSeriesData,
  setMetrics,
  setLoading,
  setError,
  addTimeSeriesPoints,
  removeTimeSeriesPoint,
  removeAllTimeSeriesPoints,
} from '@/types/timeSeriesSlice'

import { useCallback } from 'react'
import { useGetTimeSeriesByMonitoringPoint } from './useGetTimeSeriesByMonitoringPoint'
import { useGetMetrics } from './useGetMetrics'
import { useCreateTimeSeriesPoints } from './useCreateTimeSeriesPoints'
import { useDeleteAllByMonitoringPoint } from './useDeleteAllByMonitoringPoint'
import { useDeleteTimeSeriesPoint } from './useDeleteTimeSeriesPoint'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import type {
  CreateTimeSeriesBatchDto,
  CreateTimeSeriesPointDto,
} from '@/types/zod/timeSeries'

export const useTimeSeriesRedux = (monitoringPointId?: string) => {
  const dispatch = useAppDispatch()
  const { data, totalCount, loading, error, metrics } = useAppSelector(
    (state: { timeSeries: any }) => state.timeSeries,
  )

  const { fetchTimeSeries: fetchTimeSeriesAPI } =
    useGetTimeSeriesByMonitoringPoint()
  const { fetchMetrics: fetchMetricsAPI } = useGetMetrics()
  const { createPoints: createPointsAPI } = useCreateTimeSeriesPoints()
  const { deletePoint: deletePointAPI } = useDeleteTimeSeriesPoint()
  const { deleteAll: deleteAllAPI } = useDeleteAllByMonitoringPoint()

  const loadTimeSeries = useCallback(
    async (page = 0, pageSize = 50) => {
      if (!monitoringPointId) return
      dispatch(setLoading(true))
      const result = await fetchTimeSeriesAPI(monitoringPointId, page, pageSize)
      if (result.success && result.data) {
        dispatch(setTimeSeriesData(result.data))
      } else {
        dispatch(setError(result.message || 'Erro ao carregar série temporal'))
      }
      dispatch(setLoading(false))
    },
    [monitoringPointId, dispatch, fetchTimeSeriesAPI],
  )

  const loadMetrics = useCallback(async () => {
    if (!monitoringPointId) return
    const result = await fetchMetricsAPI(monitoringPointId)
    if (result.success && result.data) {
      dispatch(setMetrics(result.data))
    }
  }, [monitoringPointId, dispatch, fetchMetricsAPI])

  const createPoints = useCallback(
    async (points: CreateTimeSeriesPointDto | CreateTimeSeriesBatchDto) => {
      const result = await createPointsAPI(points)
      if (result.success && result.data) {
        dispatch(addTimeSeriesPoints(result.data))
        if (monitoringPointId) loadMetrics()
      }
      return result
    },
    [dispatch, createPointsAPI, monitoringPointId, loadMetrics],
  )

  const deletePoint = useCallback(
    async (dataPointId: string) => {
      const result = await deletePointAPI(dataPointId)
      if (result.success) {
        dispatch(removeTimeSeriesPoint(dataPointId))
        if (monitoringPointId) loadMetrics()
      }
      return result
    },
    [dispatch, deletePointAPI, monitoringPointId, loadMetrics],
  )

  const deleteAll = useCallback(async () => {
    if (!monitoringPointId)
      return { success: false, message: 'ID não informado' }
    const result = await deleteAllAPI(monitoringPointId)
    if (result.success) {
      dispatch(removeAllTimeSeriesPoints())
      if (monitoringPointId) loadMetrics()
    }
    return result
  }, [dispatch, deleteAllAPI, monitoringPointId, loadMetrics])

  const currentMetrics = monitoringPointId ? metrics[monitoringPointId] : null

  return {
    data,
    totalCount,
    loading,
    error,
    metrics: currentMetrics,
    loadTimeSeries,
    loadMetrics,
    createPoints,
    deletePoint,
    deleteAll,
  }
}
