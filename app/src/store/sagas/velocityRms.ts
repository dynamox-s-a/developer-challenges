import { call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  getVelocityRmsData,
  setVelocityRmsData,
  setLines,
  setStatus,
} from '../reducers/velocityRms';
import chartsService from '../../services/charts';
import { TDataChartLine, TResponseChart } from '../../common/types';
import { generateLineChart } from '../../utils/generateLineChart';

function* monitorVelocity() {
  try {
    yield put(setStatus('loading'));
    yield delay(3000);
    const xVelocityRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'velocityRms/x',
    );
    const yVelocityRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'velocityRms/y',
    );
    const zVelocityRmsData: TResponseChart = yield call(
      chartsService.getByName,
      'velocityRms/z',
    );
    yield put(setVelocityRmsData(xVelocityRmsData));
    yield put(setVelocityRmsData(yVelocityRmsData));
    yield put(setVelocityRmsData(zVelocityRmsData));

    const xVelociteAxis: TDataChartLine = yield call(generateLineChart, {
      data: xVelocityRmsData,
      axisName: 'Axial',
    });
    const yVelociteAxis: TDataChartLine = yield call(generateLineChart, {
      data: yVelocityRmsData,
      axisName: 'Radial',
    });
    const zVelociteAxis: TDataChartLine = yield call(generateLineChart, {
      data: zVelocityRmsData,
      axisName: 'Horizontal',
    });

    yield put(setLines(xVelociteAxis));
    yield put(setLines(yVelociteAxis));
    yield put(setLines(zVelociteAxis));

    yield put(setStatus('success'));
  } catch (error) {
    yield put(setStatus('error'));
    console.log('🚀 ~ monitorVelocity ~ error:', error);
  }
}

export function* velocityRmsSaga() {
  yield takeLatest(getVelocityRmsData, monitorVelocity);
}
