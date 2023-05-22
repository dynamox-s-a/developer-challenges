import { createStore } from 'redux';

const initialState = {

};

const myAction = {
    type: 'MY_ACTION',
    payload: null
}

const myReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'MY_ACTION':
            return {
                ...state,
            };
        default:
            return state;
    }
}

const store = createStore(myReducer);

export default store;