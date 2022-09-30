import { GETALLPRODUCTS } from '../actions';

const initialState = {
  productsArr: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
  case GETALLPRODUCTS:
    return {
      productsArr: action.value,
    };
  default:
    return state;
  }
};

export default productReducer;
