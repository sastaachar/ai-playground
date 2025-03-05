import React, { useState } from 'react';
import './Home.css';
import ChatBox from '../Playground';
import Stackblitz from '../Stackblitz';

const Home: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={`home-container ${showPreview ? 'preview-mode' : ''}`}>
      <div className="left-panel">
        <ChatBox 
          setShowPreview={setShowPreview} 
          setCurrentCode={setCurrentCode} 
        />
      </div>
      {showPreview && (
        <div className="right-panel">
          <Stackblitz code={currentCode} />
        </div>
      )}
    </div>
  );
};

export default Home;
