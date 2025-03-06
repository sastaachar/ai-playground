import React from 'react';
import './App.css';
import Home from './components/Home';
import { Deployment } from './components/Deployment';
import { Routes, Route } from "react-router";
import { useAppContext } from './context/AppContext';
import { Loader } from './components/Loader';
import RunContainer from './components/RunContainer';

const App: React.FC = () => {
  
  const { isLoading } = useAppContext();
  
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deployment/:deploymentId" element={<Deployment />} />
      <Route path="/run-container" element={<RunContainer />} />
    </Routes>
    </div>
  );
}

export default App;
