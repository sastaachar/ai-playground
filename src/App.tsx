import React from 'react';
import './App.css';
import Home from './components/Home';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AiChat } from './AiChat'



const App: React.FC = () => {
  
  return (
    <div className="App">
      <h1>AI Playground</h1>
      {/* <AiChat /> */}
      <Home />
    </div>
  );
}

export default App;
