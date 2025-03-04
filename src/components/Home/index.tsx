import React, { useState } from 'react';
import './Home.css';
import Stackblitz from '../Stackblitz';
import ChatBox from '../Playground';

const Home: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');

  return (
    <div className="home-container">
      <div className="left-panel">
        <ChatBox />
      </div>
      <div className="right-panel">
        <Stackblitz code={currentCode} />
      </div>
    </div>
  );
};

export default Home;
