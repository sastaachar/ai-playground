import React from 'react';
import './App.css';
import Home from './components/Home';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="header">
        <h2 style={{fontSize:"20px", fontWeight:"bold", padding:20, color:"black"}}>
          {"AI"} 
          <br />
          {"Playground"}
        </h2>
        </div>
      <Home />
    </div>
  );
}

export default App;
