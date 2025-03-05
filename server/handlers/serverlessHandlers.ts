import { allowCors } from "../cors-handler.js";
import { ask } from "./convo/ask.js";

const convoAsk = allowCors(ask)

export {
  convoAsk
}