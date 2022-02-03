import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import NavBar from './components/NavBar';
import './index.css';
import reportWebVitals from './reportWebVitals';
import configureStore from './store'

const store = configureStore();


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <NavBar />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
