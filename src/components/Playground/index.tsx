import React, { useState } from "react";
import "./index.css";
import { askApi } from "../../utils/openAi";
import { ProChat } from "@ant-design/pro-chat";
import { Editor } from "@monaco-editor/react";
import { FaPlayCircle, FaRobot, FaUser } from "react-icons/fa";
import { VscRunAll } from "react-icons/vsc";
import { GrDeploy } from "react-icons/gr";
import { PiBracketsCurlyLight } from "react-icons/pi";
import { useAppContext } from "../../context/AppContext";
import { getChunkParser } from "../../utils";
import { AI_MODEL } from "../../../server/types";
import { ListAltOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";

interface ChatBoxProps {
  setShowPreview: (show: any) => void;
  setShowRestSDK: (show: any) => void;
  callCreateDeployment: (code: string) => void;
  deployedIds: any;
  setShowList: (show: any) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setShowPreview, setShowRestSDK, callCreateDeployment, setShowList }) => {
  const { setCode } = useAppContext();
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isRestSDKActive, setIsRestSDKActive] = useState(false);
  const [isListActive, setIsListActive] = useState(true);

  const renderCodeEditor = ({ children }: { children: any }) => (
    <>
      <Editor
        defaultLanguage="javascript"
        height="50vh"
        value={(children[0] as any).props.children[0]}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          inDiffEditor: false,
          readOnly: false,
        }}
        onMount={() => {
          setCode((children[0] as any).props.children[0]);
        }}
        width="100%"
        onChange={(value) => {
          setCode(value);
        }}
      />
      <div className="editor-actions">
        <button
          className="run-button"
          onClick={() => {
            setShowPreview(true);
          }}
        >
          <VscRunAll className="action-icon" />
        </button>
        <button
          className="deploy-button"
          onClick={() => callCreateDeployment((window as any)._contentCache.code)}
        >
          <GrDeploy className="action-icon" />
        </button>
      </div>
    </>
  );

  const previewToggle = () => {
    return (
      <FaPlayCircle
        className="preview-toggle"
        style={{ color: isPreviewActive ? "blue" : "inherit" }}
        onClick={() => {
          setShowPreview((prev) => !prev);
          setShowRestSDK(false);
          setIsPreviewActive((prev) => !prev);
          setIsRestSDKActive(false);
        }}
      />
    );
  };

  const restSDKToggle = () => {
    return (
      <PiBracketsCurlyLight
        className="rest-sdk-toggle"
        style={{ color: isRestSDKActive ? "white" : "inherit", backgroundColor: isRestSDKActive ? "blue" : "inherit"}}
        onClick={() => {
          setShowRestSDK((prev) => !prev);
          setShowPreview(false);
          setIsRestSDKActive((prev) => !prev);
          setIsPreviewActive(false);
        }}
      />
    );
  };

  const listToggle = () => {
    return (
      <ListAltOutlined
        className="list-toggle"
        style={{ color: isListActive ? "blue" : "inherit" }}
        onClick={() => {
          setShowList((prev) => !prev);
          setIsListActive((prev) => !prev);
        }}
      />
    );
  };

  const { model } = useAppContext();
  return (
    <ProChat
      userMeta={{
        avatar: "https://i.ytimg.com/vi/s9dbAfjlrks/maxresdefault.jpg",
        title: "You"
      }}
      assistantMeta={{
        avatar: "http://cdn.akc.org/content/article-body-image/housetrain_adult_dog_hero.jpg",
        title: "AI Assistant"
      }}
      request={async (messages) => {
        const currentQuery = (messages[messages.length - 1] as any).message || "";
        let prevMessage = undefined;
        if (messages.length > 1) {
          prevMessage = {};
          const lastReply = (messages[messages.length - 2] as any).content || "";
          const lastQuery = (messages[messages.length - 3] as any).content || "";
          prevMessage = {
            query: lastQuery,
            response: lastReply
          }
        }
        // const { model } = window._cacheContent || {};

        return await askApi({query:currentQuery, prevMessage, model});
      }}
      locale="en-US"
      actions={{
        render: (defaultDoms) => [
          previewToggle(),
          restSDKToggle(),
          listToggle(),
          ...defaultDoms
        ]
      }}
      transformToChatMessage={ getChunkParser(model)}
      markdownProps={{
        components: {
          pre: renderCodeEditor
        }
      }}
    />
  );
};
export default ChatBox;
