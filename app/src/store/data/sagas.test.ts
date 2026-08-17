import { describe, expect, it } from 'vitest';
import type { CallEffect, ForkEffect, PutEffect } from 'redux-saga/effects';

import { api } from '../../services/api';
import { fetchDataFailure, fetchDataSuccess } from './actions';
import * as sagas from './sagas';
import { DataActionTypes } from './types';
import type { Data } from '../../types/data';

type SagaGenerator = Generator<CallEffect | PutEffect | ForkEffect, void, unknown>;
type SagaFactory = () => SagaGenerator;

type SagaModule = {
  fetchDataSaga?: SagaFactory;
  handleFetchData?: SagaFactory;
  getDataSaga?: SagaFactory;
  dataSaga?: SagaFactory;
  watchDataSaga?: SagaFactory;
};

const sagaModule = sagas as SagaModule;

const fetchDataSaga =
  sagaModule.fetchDataSaga ?? sagaModule.handleFetchData ?? sagaModule.getDataSaga;

const dataSaga = sagaModule.dataSaga ?? sagaModule.watchDataSaga;

if (!fetchDataSaga || !dataSaga) {
  throw new Error('Expected saga exports were not found');
}

describe('fetchDataSaga', () => {
  it('calls api.getData and dispatch success', () => {
    const data: Data[] = [
      { name: 'Item 1', data: [] },
      { name: 'Item 2', data: [] },
    ];
    const generator = fetchDataSaga();

    const callResult = generator.next();
    const callEffect = callResult.value as CallEffect;
    expect(callEffect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'CALL',
    });
    expect(callEffect.payload.fn).toBe(api.getData);

    const putResult = generator.next(data);
    const putEffect = putResult.value as PutEffect;
    expect(putEffect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'PUT',
    });
    expect(putEffect.payload.action).toEqual(fetchDataSuccess(data));

    expect(generator.next().done).toBe(true);
  });

  it('calls api.getData and dispatch failure when api.getData throws', () => {
    const error = new Error('Network error');
    const generator = fetchDataSaga();

    generator.next();

    const putResult = generator.throw(error);
    const putEffect = putResult.value as PutEffect;
    expect(putEffect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'PUT',
    });
    expect(putEffect.payload.action).toEqual(
      fetchDataFailure('Não foi possível carregar os dados.'),
    );

    expect(generator.next().done).toBe(true);
  });
});

describe('dataSaga', () => {
  it('calls FETCH_REQUEST and bind the worker saga', () => {
    const generator = dataSaga();
    const result = generator.next();
    const effect = result.value as ForkEffect;

    expect(effect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'FORK',
    });
    expect(effect.payload.args[0]).toBe(DataActionTypes.FETCH_REQUEST);
    expect(effect.payload.args[1]).toBe(fetchDataSaga);
  });
});
