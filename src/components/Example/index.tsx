import React, { useState } from 'react';
import ChatAPI from '../../APIs';

const Example = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setLoading(true);
    try {
      const answer = await ChatAPI.mockAskQuestion(question);
      setResponse(answer.text);
      
      // If you want to use the code
      if (answer.code) {
        console.log('Generated code:', answer.code);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error getting response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => askQuestion('Create a counter component')}
        disabled={loading}
      >
        Ask for Counter Component
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{response}</p>
      )}
    </div>
  );
};

export default Example; 