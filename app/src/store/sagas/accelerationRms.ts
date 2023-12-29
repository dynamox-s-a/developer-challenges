import { call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  getAccRmsData,
  setAccRmsData,
  setLines,
  setStatus,
} from '../reducers/accelerationRms';
import chartsService from '../../services/charts';
import { TDataChartLine, TResponseChart } from '../../common/types';
import { generateLineChart } from '../../utils/generateLineChart';

function* monitorAcceleration() {
  try {
    yield put(setStatus('loading'));
    yield delay(3000);
    const xAccelerationRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'accelerationRms/x',
    );
    const yAccelerationRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'accelerationRms/y',
    );
    const zAccelerationRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'accelerationRms/z',
    );
    yield put(setAccRmsData(xAccelerationRmsData));
    yield put(setAccRmsData(yAccelerationRmsData));
    yield put(setAccRmsData(zAccelerationRmsData));

    const xAccLine: TDataChartLine = yield call(generateLineChart, {
      data: xAccelerationRmsData,
      axisName: 'Axial',
    });
    const yAccLine: TDataChartLine = yield call(generateLineChart, {
      data: yAccelerationRmsData,
      axisName: 'Radial',
    });
    const zAccLine: TDataChartLine = yield call(generateLineChart, {
      data: zAccelerationRmsData,
      axisName: 'Horizontal',
    });

    yield put(setLines(xAccLine));
    yield put(setLines(yAccLine));
    yield put(setLines(zAccLine));

    yield put(setStatus('success'));
  } catch (error) {
    yield put(setStatus('error'));
    console.log('🚀 ~ monitorAcceleration ~ error:', error);
  }
}

export function* accelerationRmsSaga() {
  yield takeLatest(getAccRmsData, monitorAcceleration);
}
