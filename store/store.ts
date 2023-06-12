import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import machineReducer from "./reducers/machineReducers";

const initalState = {};

const middleware = [thunk];

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  machines: machineReducer,
});

export const store = createStore(
  rootReducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
