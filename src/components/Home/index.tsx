import React, { useState } from 'react';
import './Home.css';
import ChatBox from '../Playground';
import Stackblitz from '../Stackblitz';
import CurlVisualizer from '../RestSDK';


const Home: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showRestSDK, setShowRestSDK] = useState(false);
  const [currentCurl, setCurrentCurl] = useState('curl -X GET https://dog.ceo/api/breeds/image/random');

  return (
    <div className={`home-container ${showPreview || showRestSDK ? 'preview-mode' : ''}`}>
      <div className="left-panel">
        <ChatBox 
          setShowPreview={setShowPreview} 
          setCurrentCode={setCurrentCode} 
          setShowRestSDK={setShowRestSDK}
        />
      </div>
      { 
        <div className={`right-panel ${showPreview ? 'visible' : 'hidden'}`}>
          <div style={{width: '100%', height: '60%'}}>
            <Stackblitz code={currentCode} />
          </div>
        </div>
      }
      { 
        <div className={`right-panel ${showRestSDK ? 'visible' : 'hidden'}`}>
          <div className="right-panel-rest-sdk">
            <CurlVisualizer curlCommand={currentCurl} />
          </div>
        </div>
      }

    </div>
  );
};

export default Home;
