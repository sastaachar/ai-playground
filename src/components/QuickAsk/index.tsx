import React, { useState } from 'react';
import ChatAPI from '../../APIs';

interface Props {
  onCodeChange?: (code: string) => void;
}

const QuickAsk: React.FC<Props> = ({ onCodeChange }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const answer = await ChatAPI.mockAskQuestion(question);
      setResponse(answer.text);
      
      if (answer.code && onCodeChange) {
        onCodeChange(answer.code);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error getting response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-ask-container">
      <div className="input-group">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button 
          onClick={handleAsk} 
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Generating response...</div>
      ) : response && (
        <div className="response">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default QuickAsk; 