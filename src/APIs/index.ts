import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface Answer {
    text: string;
    type: string;
    code?: string;
}

class ChatAPI {
    static async askQuestion(question: string): Promise<Answer> {
        try {
            const response = await axios.post(`${BASE_URL}/api/chat`, {
                question: question,
            });

            return {
                text: response.data.text,
                code: response.data.code,
                type: response.data.type,
            };
        } catch (error) {
            console.error('Error asking question:', error);
            throw new Error('Failed to get answer');
        }
    }

    static async mockAskQuestion(question: string): Promise<Answer> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            text: `Here's a React component based on your request: "${question}"`,
            type: "vesdk",
            code: `
import React, { useState } from 'react';

const App = () => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="App">
      <h1>${question}</h1>
      <input 
        value={value}
        onChange={handleChange}
        placeholder="Type here..."
      />
      <p>You typed: {value}</p>
    </div>
  );
};

export default App;`
        };
    }
}

export default ChatAPI;
