

export type Message = {
    sender: 'user' | 'assistant';
    text: string;
    code?: string;
  };
  
export interface ChatGPTProps {
    onCodeChange?: (code: string) => void;
  }
