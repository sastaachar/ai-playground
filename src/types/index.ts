

export type Message = {
    sender: 'user' | 'assistant';
    text: string;
    code?: string;
  };
  
export interface PlaygroundProps {
    onCodeChange?: (code: string) => void;
  }
