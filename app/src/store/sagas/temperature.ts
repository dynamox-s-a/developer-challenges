import { call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  getTemperatureData,
  setTemperatureData,
  setLines,
  setStatus,
} from '../reducers/temperature';
import { TDataChartLine, TResponseChart } from '../../common/types';
import chartsService from '../../services/charts';
import { generateLineChart } from '../../utils/generateLineChart';

function* monitorTemperature() {
  try {
    yield put(setStatus('loading'));
    yield delay(3000);
    const temperatureData: TResponseChart = yield call(
      chartsService.getByName,
      'temperature',
    );

    yield put(setTemperatureData(temperatureData));

    const temperatureAxis: TDataChartLine = yield call(generateLineChart, {
      data: temperatureData,
      axisName: 'Temperatura',
    });

    yield put(setLines(temperatureAxis));
    yield put(setStatus('success'));
  } catch (error) {
    yield put(setStatus('error'));
    console.log('🚀 ~ monitorTemperature ~ error:', error);
  }
}

export function* temperatureSaga() {
  yield takeLatest(getTemperatureData, monitorTemperature);
}
