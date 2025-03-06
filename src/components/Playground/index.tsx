import React from "react";
import "./index.css";
import { askApi } from "../../utils/openAi";
import { ProChat } from "@ant-design/pro-chat";
import { Editor } from "@monaco-editor/react";
import { FaPlayCircle } from "react-icons/fa";
import { VscRunAll } from "react-icons/vsc";
import { GrDeploy } from "react-icons/gr";
import { PiBracketsCurlyLight } from "react-icons/pi";

import { useAppContext } from "../../context/AppContext";
import { getChunkParser } from "../../utils";
import { AI_MODEL } from "../../../server/types";
import { ListAltOutlined } from "@mui/icons-material";
interface ChatBoxProps {
  setShowPreview: (show: any) => void;
  setShowRestSDK: (show: any) => void;
  callCreateDeployment: (code: string) => void;
  deployedIds: any;
  setShowList: (show: any) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setShowPreview, setShowRestSDK, callCreateDeployment, setShowList }) => {
  
  const { setCode } = useAppContext();

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
          readOnly: false,
        }}
        onMount={() => {
          setCode((children[0] as any).props.children[0]);
        }}
        onChange={(value) => {
          setCode(value);
        }}
      />
      <div className="editor-actions">
        <button
          className="run-button"
          onClick={() => {
            setShowPreview(true);
            // setCode(code);
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
        onClick={() => {setShowPreview(prev => !prev); setShowRestSDK(false)}}
      />
    );
  };

  const restSDKToggle = () => {
    return (
      <PiBracketsCurlyLight className="rest-sdk-toggle" onClick={() => {setShowRestSDK(prev => !prev); setShowPreview(false)}} />
    );
  };

  const listToggle = () => {
    return (
      <ListAltOutlined className="list-toggle" onClick={() => {setShowList(prev => !prev); setShowPreview(false); setShowRestSDK(false)}} />
    )
  }

  const { model } = useAppContext();
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
