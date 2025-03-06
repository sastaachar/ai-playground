import React, { useState, useEffect } from "react";
import "./Home.css";
import ChatBox from "../Playground";
import Stackblitz from "../Stackblitz";
import CurlVisualizer from "../RestSDK";
import { useAppContext } from "../../context/AppContext";
import { createDeployment } from "../../services";
import { Button, notification, Space } from "antd";
import { DeploimentList } from "../DeploimentList";

const Home: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showRestSDK, setShowRestSDK] = useState(false);
  const { username, host, code } = useAppContext();
  const [deployedIds, setDeployedIds] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [showList, setShowList] = useState(true);

  const callCreateDeployment = async (code: string) => {
    try {
      const response = await createDeployment(code, username, host);
      setDeployedIds([...deployedIds, response.id]);
      openNotification(response.id);
    } catch (error) {
      api.error({
        message: "Deployment Failed",
        description: "Please try again.",
        placement: "bottom",
      });
    }
  };

  const openNotification = (id: string) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => window.open(`/deployment/${id}`, "_blank")}
        >
          Go to Deployment
        </Button>
      </Space>
    );
    api.success({
      message: "Deployed Successfully",
      description:
        "Your application has been deployed successfully. You can now view it by clicking the button below.",
      btn,
      key,
      placement: "bottom",
    });
  };

  return (
    <div className="App">
      <div
        className={`${ showList ? "home-container" : "home-container-w-list"} ${showPreview || showRestSDK ? "preview-mode" : ""}`}
      >
        <div className={`${!showList ? "left-panel-w-list" : "left-panel"}`}>
          <ChatBox
            setShowPreview={setShowPreview}
            setShowRestSDK={setShowRestSDK}
            callCreateDeployment={callCreateDeployment}
            deployedIds={deployedIds}
            setShowList={setShowList}
          />
        </div>
        {
          <div className={`right-panel ${showPreview ? "visible" : "hidden"} ${!showList ? "right-panel-w-list" : ""}`}>
            <div style={{ width: "100%", height: "95%" }}>
             { showPreview && <Stackblitz code={code} />}
            </div>
          </div>
        }
        {
          <div className={`right-panel ${showRestSDK ? "visible" : "hidden"} ${!showList ? "right-panel-w-list" : ""}`}>
            <div className="right-panel-rest-sdk">
              { showRestSDK && <CurlVisualizer curlCommand={code} />}
            </div>
          </div>
        }
        {contextHolder}
        {
          <div className={`${!showList ? "" : "right-panel-list"}`}>
            <div className="right-panel-list-container">
              {showList && <DeploimentList />}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Home;
