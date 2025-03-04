import { getGPTResponse } from "../__server/open-ai.js";
import { allowCors } from "../__server/cors-handler.js";
import { addSimpleContext } from "../__server/context-provider/get-simple-context.js";
import { getSimpleMessages } from "../__server/message-creation/simple-message.js";


/**
 * Need this for streaming, or else it will wait for the buffer then respond.
 */
export const config = {
  runtime: 'edge',
}

async function start(request: Request) {

  try {
    const body = await request.json();
    if (!body.query) throw new Error('No query provided');

    const { query, model, prevMessage } = body;
    const messageWithContext = addSimpleContext(query);

    console.log(messageWithContext);

    const messages = getSimpleMessages(messageWithContext, prevMessage);

    return getGPTResponse(messages, model);       
  }
  catch (e) { return new Response('Invalid input, ' + e.message, { status: 400 }) }

}

export default allowCors(start);