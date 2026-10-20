import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";
import { it } from "vitest";

import { fetchDataWorker } from "../features/data/dataSaga";
import { fetchMachine, fetchSeries } from "../features/data/api";
import { machineFixture, seriesDtoFixture } from "./features/data/fixtures";
import {
  fetchDataFailed,
  fetchDataSucceeded,
} from "../features/data/dataSlice";
import { toChartData } from "../features/data/transform";
import { throwError } from "redux-saga-test-plan/providers";

it("puts success with normalized charts", () =>
  expectSaga(fetchDataWorker)
    .provide([
      [call(fetchMachine), machineFixture],
      [call(fetchSeries), seriesDtoFixture],
    ])
    .put(
      fetchDataSucceeded({
        machine: machineFixture,
        charts: toChartData(seriesDtoFixture),
      }),
    )
    .run());

it("puts failure when the API throws", () =>
  expectSaga(fetchDataWorker)
    .provide([
      [call(fetchMachine), throwError(new Error("error"))],
      [call(fetchSeries), seriesDtoFixture],
    ])
    .put(fetchDataFailed("error"))
    .run());
