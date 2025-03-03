import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import ChatAPI from '../../APIs';
import { ChatGPTProps, Message } from '../../types';


const ChatGPT: React.FC<ChatGPTProps> = ({ onCodeChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!userInput) return;
    const newMessages = [...messages, { sender: 'user' as const, text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await ChatAPI.mockAskQuestion(userInput);
      const newMessage = {
        sender: 'assistant' as const,
        text: response.text,
        code: response.code
      };
      setMessages([...newMessages, newMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages([
        ...newMessages,
        { sender: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = (code: string) => {
    if (onCodeChange) {
      const cleanedCode = code.replace(/export default \w+;/, 'export default App;')
        .replace(/const \w+ = /, 'const App = ');
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    )
  }

  const renderMessages = () => {
    return (
      <div className="messages-area" ref={containerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === 'user' ? 'human-message' : 'ai-message'}`}>
            <div className="message-content">
              {msg.text}
              {msg.code && (
                <pre>
                  <code>{msg.code}</code>
                </pre>
              )}
              {msg.code && (
                <div className="code-actions">
                  <button onClick={() => {
                    if (msg.code) navigator.clipboard.writeText(msg.code);
                  }}>
                    Copy
                  </button>
                  <button onClick={() => {
                    if (msg.code) handleRunCode(msg.code);
                  }}>
                    Run Code
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

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

export default ChatGPT;
