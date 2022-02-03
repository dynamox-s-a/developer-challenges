import { put, takeEvery,takeLatest, call } from "redux-saga/effects";
import Api from "../../helpers/Api";


import {
  Types as Produtosypes,
  Creators as ProdutosActions
} from "../ducks/Produtos";


function* getProdutos(action) {
  console.log("Entrou aqui", action) 
  try {
      const response = yield call(Api.getProdutos); 
      console.log("RESPONSE", response)    
    yield put(ProdutosActions.getProdutosSuccess(response));
  } catch (e) {
    yield put(ProdutosActions.getProdutosFailure(e));
  }    
}

  // function* postProdutos() {
  //   try {
  //  const  response = yield call(Api.CadProdutos )
  //     yield put(ProdutosActions.reateProdutosRequest(response));
  //   }
  //   catch (e) {
  //    yield put(ProdutosActions.getProdutosFailure(e));
  //   }
  // }

  function * delProduto(dados) {
    console.log("Entrou em del")
   yield call(Api.delProdutos(dados.id));
   
    
  }


export default function* () {
  //observa o type, quando enxergar executa a funçao
  yield takeLatest(Produtosypes.GET_PRODUTOS_REQUEST, getProdutos);
  yield takeLatest(Produtosypes.DELETE_PRODUTO, delProduto);

  //yield takeEvery(Produtosypes.CAD_PRODUTOS__REQUEST, postProdutos);
 
};