import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { PlaygroundProps, Message, Sender } from "../../types";
import { askApi, streamOpenAI } from "../../utils/openAi";
import { v4 as uuidv4 } from "uuid";
import { ProChat } from "@ant-design/pro-chat";

const ChatGPT: React.FC<PlaygroundProps> = ({ onCodeChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!userInput) return;

    const newMessages: Message[] = [
      ...messages,
      { sender: Sender.User, text: userInput, id: uuidv4() },
      { sender: Sender.Assistant, text: "Thinking...", id: uuidv4() },
    ];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      streamOpenAI({
        query: userInput,
        onData: (data) => {
          setMessages((messages) => {
            const newMessages = [...messages];
            newMessages[newMessages.length - 1].text = data;
            return newMessages;
          });
        },
      });
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = (code: string) => {
    if (onCodeChange) {
      const cleanedCode = code
        .replace(/export default \w+;/, "export default App;")
        .replace(/const \w+ = /, "const App = ");
      onCodeChange(cleanedCode);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderInputComponent = () => {
    return (
      <div className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask for a React component example..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    );
  };

  const renderMessages = () => {
    return (
      <div className="messages-area" ref={containerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === Sender.User ? "human-message" : "ai-message"
            }`}
          >
            <div className="message-content">
              {msg.text}
              {msg.code && (
                <pre>
                  <code>{msg.code}</code>
                </pre>
              )}
              {msg.code && (
                <div className="code-actions">
                  <button
                    onClick={() => {
                      if (msg.code) navigator.clipboard.writeText(msg.code);
                    }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      if (msg.code) handleRunCode(msg.code);
                    }}
                  >
                    Run Code
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="messages-area" ref={containerRef}>
        {renderMessages()}
        {loading && (
          <div className="chat-message ai-message">
            <div className="message-content">Generating code example...</div>
          </div>
        )}
      </div>
      {renderInputComponent()}
    </div>
  );
};

const NewChat = () => {
  return (
    <ProChat
      request={async (messages) => {
        const lastMessage =
          (messages[messages.length - 1] as any).message || "";

        if (messages.length > 2) {
          // pipe through
          return await askApi(lastMessage);
        }
        return await askApi(lastMessage);
      }}
      locale="en-US"
      chatItemRenderConfig={{
        contentRender: (P, A) => {
          // console.log("a", P.message);
          return A;
        },
      }}
      transformToChatMessage={(text) => {
        // not a data chunk
        if (!text.includes('data:')) {
          return text;
        }
        
        let result = '';
        
        const chunks = text.split('data:');
        
        for (const chunk of chunks) {
          const payload = chunk.trim();
          if (!payload || payload === '[DONE]') continue;
          
          try {
            const data = JSON.parse(payload);
            const content = data?.choices?.[0]?.delta?.content;
            if (content) result += content;
          } catch (e) {
            // JSON parse failed, ( due to split json)
            const contentMatch = payload.match(/"delta":\s*{\s*"content":\s*"([^"]*)"/);
            if (contentMatch && contentMatch[1]) {
              result += contentMatch[1];
            }
          }
        }
        
        return result;
      }}
    />
  );
};

export default NewChat;
