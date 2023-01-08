import React from 'react';

import { Contact, Dynapredict, Header } from './containers';
import { Navbar } from './components';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="initial__bg">
        <Navbar />
        <Header />
      </div>
      <Dynapredict />
      <Contact />
    </div>
  )
}

export default App
