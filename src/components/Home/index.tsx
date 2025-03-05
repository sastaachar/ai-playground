import React, { useState, useEffect } from 'react';
import './Home.css';
import ChatBox from '../Playground';
import Stackblitz from '../Stackblitz';
import CurlVisualizer from '../RestSDK';
import { useAppContext } from '../../context/AppContext';
import { createDeployment } from '../../services';
import { Button, notification, Space } from 'antd';


const Home: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showRestSDK, setShowRestSDK] = useState(false);
  const [currentCurl, setCurrentCurl] = useState('curl -X GET https://dog.ceo/api/breeds/image/random');
  const { username, host } = useAppContext();
  const [deployedIds, setDeployedIds] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const callCreateDeployment = async (code: string) => {
    try {
      const response = await createDeployment(code, username, host);
      setDeployedIds([...deployedIds, response.id]);
      openNotification(response.id)
    } catch (error) {
      api.error({
        message: 'Deployment Failed',
        description: 'Please try again.',
        placement: 'bottom',
      });
    }
  }

  const openNotification = (id: string) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => window.open(`/deployment/${id}`, '_blank')}>
          Go to Deployment
        </Button>
      </Space>
    );
      api.success({
        message: 'Deployed Successfully',
        description:
          'Your application has been deployed successfully. You can now view it by clicking the button below.',
        btn,
        key,
        placement: 'bottom',
      });
    };

  return (
    <div className={`home-container ${showPreview || showRestSDK ? 'preview-mode' : ''}`}>
      <div className="left-panel">
        <ChatBox 
          setShowPreview={setShowPreview} 
          setCurrentCode={setCurrentCode} 
          setShowRestSDK={setShowRestSDK}
          callCreateDeployment={callCreateDeployment}
          deployedIds={deployedIds}
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
      {contextHolder}
    </div>
  );
};

export default Home;
