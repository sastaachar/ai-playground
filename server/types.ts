import exp from "constants"

export enum AI_MODEL {
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O = 'gpt-4o',
  GPT_O1 = 'o1',
  GPT_O1_MINI = 'o1-mini',
  GPT_O3_MINI = 'o3-mini',
  ONYX = 'onyx',
}

export enum EMBEDDING_MODEL {
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
}

export enum Role {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
  Function = 'function',
  Tool = 'tool',
}

export type Message = {
  role: Role,
  content: string,
}