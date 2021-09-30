import { createActions, createReducer } from "reduxsauce";


export const { Types, Creators } = createActions({  
  getProdutosSuccess: ["produtos"],
  getProdutosRequest: [], 
  getProdutosFailure: [],
  postProdutosRequest:[]
  
});

const INITIAL_STATE = {
  produtosList: [],
  produtosInnput: [],
  loading: false
};


const getProdutosSuccess = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    produtosList:[...state.produtosList, ...action.produtos],
    loading: false
  }    
};

const getProdutosFailure = (state = INITIAL_STATE) => {
  return {
    ...state,
    loading: false
  }
};

const getProdutosRequest = (state = INITIAL_STATE) => {
  return {
    ...state,
    loading: false
  }
};
   
  const createProdutosRequest = (state = INITIAL_STATE, action) => {
    return {
      ...state,
      produtosInnput:[...state.produtosInnput, ...action.produtos],
    loading: false
    }
  
};

 







export default createReducer(INITIAL_STATE, { 
  [Types.GET_PRODUTOS_SUCCESS]: getProdutosSuccess,
  [Types.GET_PRODUTOS_FAILURE]: getProdutosFailure,
  [Types.GET_PRODUTOS_REQUEST]: getProdutosRequest,
  [Types.CREATE_PRODUTOS_REQUEST]: createProdutosRequest
  
  
});
  