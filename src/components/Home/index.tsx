import React, { useState } from 'react';
import './Home.css';
import ChatBox from '../Playground';
import Stackblitz from '../Stackblitz';
import CurlVisualizer from '../RestSDK';
import { Button } from 'antd';

const Home: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showRestSDK, setShowRestSDK] = useState(false);
  const [currentCurl, setCurrentCurl] = useState('curl -X GET https://dog.ceo/api/breeds/image/random');
  const [visualPlayground, setVisualPlayground] = useState(true);

  return (
    <>
    <Button onClick={() => setVisualPlayground(!visualPlayground)}>Visual Playground</Button>
    {visualPlayground && 
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
    }
    {
      !visualPlayground && (
      <div className={`home-container-rest-sdk ${showPreview ? 'preview-mode' : ''}`}>
        <div className="left-panel-rest-sdk">
          <div>Hello bhai</div> 
        </div> 
        <div className="right-panel-rest-sdk">
          <CurlVisualizer curlCommand={currentCurl} />
        </div>
      </div>
      )}
    </>
  );
};

export default Home;
