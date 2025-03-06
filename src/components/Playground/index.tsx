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
import { ListAltOutlined } from "@mui/icons-material";
import { createChatSession } from "../../services/onyx";

interface ChatBoxProps {
  setShowPreview: (show: any) => void;
  setShowRestSDK: (show: any) => void;
  callCreateDeployment: (code: string) => void;
  deployedIds: any;
  setShowList: (show: any) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setShowPreview, setShowRestSDK, callCreateDeployment, setShowList }) => {
  const { setEditorCode } = useAppContext();
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isRestSDKActive, setIsRestSDKActive] = useState(false);
  const [isListActive, setIsListActive] = useState(true);

  const renderCodeEditor = ({ children }: { children: any }) => {
    setEditorCode((children[0] as any).props.children[0]);
    return (
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

          // console.log("onMount", children[0] as any);
          const { code } = (window as any)._contentCache;
          setEditorCode(code);
        }}
        width="100%"
        onChange={(value) => {
          console.log("onChange", value);
          setEditorCode(value);
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
  )};

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

  const { model, setChatSessionId } = useAppContext();
  return (
    <ProChat
      userMeta={{
        avatar: "👨🏻‍🎨",
        title: "You"
      }}
      assistantMeta={{
        avatar: "😎",
        title: "AI Assistant"
      }}
      request={async (messages) => {

        const isFirstMessage = messages.length === 1;
        if (isFirstMessage) {
          const { chat_session_id }  = await createChatSession();
          console.log("chat_session_id", chat_session_id);
          setChatSessionId(chat_session_id);
        }

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
        const { model, chatSessionId } = (window as any)._contentCache || {};

        return await askApi({query:currentQuery, prevMessage, model, chatSessionId : chatSessionId || ""});
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
      transformToChatMessage={getChunkParser(model)}
      markdownProps={{
        components: {
          pre: renderCodeEditor
        }
      }}
    />
  );
};
export default ChatBox;
