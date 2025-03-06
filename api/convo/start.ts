import { convoStart } from "../../server/handlers/serverlessHandlers.js";


/**
 * Need this for streaming, or else it will wait for the buffer then respond.
 */
export const config = {
  runtime: 'edge',
}

export default convoStart;