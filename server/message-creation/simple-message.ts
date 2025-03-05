import { Message, Role } from "../types.js";

const DEFAULT_SYSTEM_MESSAGE = "You are helpful assistant to web developers, trying to embed Thoughtspot in their application.";

export const getSimpleMessages = (query: string, prevMessage?: {
  query: string;
  response: string;
}, options?: {
  direct?: boolean;
}): Message[] => {

  const messages: Message[] = [];
  if (prevMessage) {
    messages.push({
      role: Role.User,
      content: prevMessage.query,
    })
    messages.push({
      role: Role.Assistant,
      content: prevMessage.response,
    })
  } else if (!options?.direct) {
    messages.push({
      role: Role.System,
      content: DEFAULT_SYSTEM_MESSAGE,
    })
  }

  messages.push({
    role: Role.User,
    content: query
  })

  return messages;
}