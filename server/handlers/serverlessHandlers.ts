import { allowCors } from "../cors-handler.js";
import { ask } from "./convo/ask.js";
import { getStartChatSessionResponse } from "./convo/start.js";

const convoAsk = allowCors(ask)
const convoStart = allowCors(getStartChatSessionResponse)
export {
  convoAsk,
  convoStart,  
}