import React from "react";
import "./index.css";
import { askApi } from "../../utils/openAi";
import { ProChat } from "@ant-design/pro-chat";
import { Editor } from "@monaco-editor/react";
import { FaPlayCircle } from "react-icons/fa";
import { VscRunAll } from "react-icons/vsc";
import { GrDeploy } from "react-icons/gr";
import { PiBracketsCurlyLight } from "react-icons/pi";
import { getChunkParser } from "../../utils";

interface ChatBoxProps {
  setShowPreview: (show: any) => void;
  setCurrentCode: (code: string) => void;
  setShowRestSDK: (show: any) => void;
  callCreateDeployment: (code: string) => void;
  deployedIds: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setShowPreview, setCurrentCode, setShowRestSDK, callCreateDeployment, deployedIds }) => {
  const renderCodeEditor = ({ children }: { children: any }) => (
    <>
      <Editor
        defaultLanguage="javascript"
        height="50vh"
        value={(children[0] as any).props.children[0]}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false
          },
          scrollBeyondLastLine: false,
          inDiffEditor: false,
          readOnly: true,
        }}
      />
      <div className="editor-actions">
        <button
          className="run-button"
          onClick={() => {
            setShowPreview(true);
            setCurrentCode((children[0] as any).props.children[0]);
          }}
        >
          <VscRunAll className="action-icon" />
        </button>
        <button
          className="deploy-button"
          onClick={() => callCreateDeployment((children[0] as any).props.children[0])}
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
        onClick={() => {setShowPreview(prev => !prev); setShowRestSDK(false)}}
      />
    );
  };

  const restSDKToggle = () => {
    return (
      <PiBracketsCurlyLight className="rest-sdk-toggle" onClick={() => {setShowRestSDK(prev => !prev); setShowPreview(false)}} />
    );
  };

  return (
    <ProChat
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
        return await askApi(currentQuery, prevMessage);
      }}
      locale="en-US"
      actions={{
        render: (defaultDoms) => [
          previewToggle(),
          restSDKToggle(),
          ...defaultDoms
        ]
      }}
      transformToChatMessage={getChunkParser()}
      markdownProps={{
        components: {
          pre: renderCodeEditor
        }
      }}
    />
  );
};
export default ChatBox;
