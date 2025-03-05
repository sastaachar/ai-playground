export enum Sender {
  User = 'User',
  Assistant = 'Assistant',
}

export type Message = {
    sender: Sender;
    text: string;
    code?: string;
    id: string;
  };
  
export interface PlaygroundProps {
    onCodeChange?: (code: string) => void;
  }

  export enum DeploymentType {
    VisualEmbedJS="VisualEmbedJS",
    Other="Other",
    RestApi="RestApi",
  }