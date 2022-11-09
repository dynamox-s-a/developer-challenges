import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'virtual:windi.css'

import { App } from './App'
import store from './store'

const rootElement = document.getElementById('root')

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement,
)
