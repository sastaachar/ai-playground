import React from 'react';
import './App.css';
import Home from './components/Home';
import { useLocation } from 'react-router-dom';
import Stackblitz from './components/Stackblitz';
import { Deployment } from './components/Deployment';

const App: React.FC = () => {
  const location = useLocation();
  const params = location.pathname.split('/').filter(item => item !== '')
  console.log("params", params);
  return params.length > 1 ? (
    <Deployment deploymentId={params[1]} />
  ) : (
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
