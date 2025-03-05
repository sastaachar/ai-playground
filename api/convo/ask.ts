import { convoAsk } from "../../server/handlers";


/**
 * Need this for streaming, or else it will wait for the buffer then respond.
 */
export const config = {
  runtime: 'edge',
}

export default convoAsk;