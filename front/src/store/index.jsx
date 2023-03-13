import {configureStore} from "@reduxjs/toolkit";

import authReducer from "./ducks/auth";
import productReducer from "./ducks/products";

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});
