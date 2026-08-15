import { describe, expect, it } from 'vitest';

import { api } from '../../services/api';
import { fetchDataFailure, fetchDataSuccess } from './actions';
import * as sagas from './sagas';
import { DataActionTypes } from './types';
import { Data } from '../../types/data';

type SagaGenerator = Generator<unknown, void, unknown>;
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

    const callEffect = generator.next().value;
    expect(callEffect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'CALL',
    });
    expect(callEffect.payload.fn).toBe(api.getData);

    const putEffect = generator.next(data).value;
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

    const putEffect = generator.throw(error).value;
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
    const effect = generator.next().value;

    expect(effect).toMatchObject({
      '@@redux-saga/IO': true,
      type: 'FORK',
    });
    expect(effect.payload.args[0]).toBe(DataActionTypes.FETCH_REQUEST);
    expect(effect.payload.args[1]).toBe(fetchDataSaga);
  });
});
