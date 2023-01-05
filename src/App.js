import React from 'react';

import { Contact, Dynapredict, Header } from './containers';
import { CTA, Sensor, Navbar } from './components';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="initial__bg">
        <Navbar />
        <Header />
      </div>
      <Dynapredict />
      <CTA />
      <Sensor />
      <Contact />
    </div>
  )
}

export default App
