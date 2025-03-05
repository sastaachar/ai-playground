import React from "react";
import "./index.css";
import { askApi } from "../../utils/openAi";
import { ProChat } from "@ant-design/pro-chat";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { FaPlayCircle } from "react-icons/fa";
import { VscRunAll } from "react-icons/vsc";
import { GrDeploy } from "react-icons/gr";
import { PiBracketsCurlyLight } from "react-icons/pi";

interface ChatBoxProps {
  setShowPreview: (show: any) => void;
  setCurrentCode: (code: string) => void;
  setShowRestSDK: (show: any) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setShowPreview, setCurrentCode, setShowRestSDK }) => {
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
          onClick={() => console.log("deploy")}
        >
          <GrDeploy className="action-icon" />
        </button>
      </div>
    </>
  );

  const DONE_TEXT = "[DONE]";
  const getContentFromChunk = (chunk: string) => {
    const jsonString = chunk.replace(/^data: /, "");
    if (jsonString === DONE_TEXT || !jsonString) return "";

    try {
      const json = JSON.parse(jsonString);
      return json.choices[0]?.delta.content;
    } catch {
      console.error("Error parsing Chunk:", jsonString);
      return "...";
    }
  };

  const CHUNK_DELIMITER = "\n\n";
  const getChunkParser = () => {
    let unProcessedText = "";
    const parser = (text: string) => {
      const isValidChunk = text.endsWith(CHUNK_DELIMITER);
      if (!isValidChunk) {
        unProcessedText += text;
        return "";
      }

      const totalText = unProcessedText + text;
      unProcessedText = "";

      const chunks = totalText.split(CHUNK_DELIMITER);
      const content = chunks.map(getContentFromChunk).join("");
      return content;
    };

    return parser;
  };

  const previewToggle = () => {
    return (
      <FaPlayCircle
        className="preview-toggle"
        onClick={() => {setShowPreview(prev => !prev); setShowRestSDK(false)}}
      />
    );
  };

  return (
    <ProChat
      request={async (messages) => {
        const lastMessage = (messages[messages.length - 1] as any).message || "";
        return await askApi(lastMessage);
      }}
      locale="en-US"
      actions={{
        render: (defaultDoms) => [
          previewToggle(),
          <PiBracketsCurlyLight className="rest-sdk-toggle" onClick={() => {setShowRestSDK(prev => !prev); setShowPreview(false)}} />,
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
