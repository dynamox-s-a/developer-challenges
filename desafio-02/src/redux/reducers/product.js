import { GET_ALL_PRODUCTS, REGISTER_NEW_PRODUCT } from '../actions';

const initialState = {
  productsArr: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_ALL_PRODUCTS:
    return {
      ...state,
      productsArr: action.value,
    };
    case REGISTER_NEW_PRODUCT:
    return {
      ...state,
      productsArr: [...state, action.value]
    };
  default:
    return state;
  }
};

export default productReducer;
