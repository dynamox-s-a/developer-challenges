import { put, takeEvery, call } from "redux-saga/effects";
import Api from "../../helpers/Api";


import {
  Types as Produtosypes,
  Creators as ProdutosActions
} from "../ducks/Produtos";


function* getProdutos(action) {
  try {
      const response = yield call(Api.getProdutos);     
    yield put(ProdutosActions.getProdutosSuccess(response));
  } catch (e) {
    yield put(ProdutosActions.getProdutosFailure(e));
  }    
}

  function* postProdutos() {
    try {
   const  response = yield call(Api.CadProdutos, 'json' )
      yield put(ProdutosActions.getProdutosSuccess(response));
    }
    catch (e) {
     yield put(ProdutosActions.getProdutosFailure(e));
    }
  }


export default function* () {
  yield takeEvery(Produtosypes.GET_PRODUTOS_REQUEST, getProdutos);
  yield takeEvery(Produtosypes.POST_PRODUTOS__REQUEST, postProdutos);
};