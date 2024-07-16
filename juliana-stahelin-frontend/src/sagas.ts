import { call, put, takeEvery } from 'redux-saga/effects'

import { getChartsFailure, getChartsSuccess } from './slices/chartsSlice'
import { getCharts } from './service/charts'
import { SeriesData } from './types/charts'


function* fetchChartsData() {
    try {
        const response: SeriesData[] = yield call(getCharts)
        if (response) {
            yield put(getChartsSuccess(response))
        }
    } catch (e) {
        if (e instanceof Error) {
            yield put(getChartsFailure(e.message))
        }
        yield put(getChartsFailure('Não foi possível carregar o gráfico.'))
    }
}

export function* watchFetchGraphData() {
    yield takeEvery('charts/getChartsFetch', fetchChartsData)
}
