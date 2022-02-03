 import { all } from "redux-saga/effects";

import produtosSaga from "./Produtos";


export default function* rootSaga() {
  yield all([produtosSaga()]);
}

