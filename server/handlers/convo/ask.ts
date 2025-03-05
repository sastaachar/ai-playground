import { addSimpleContext } from "../../context-provider/get-simple-context.js";
import { getSimpleMessages } from "../../message-creation/simple-message.js";
import { getGPTResponse } from "../../open-ai.js";

export  async function ask(request: Request) {

  try {
    const body = await request.json();
    if (!body.query) throw new Error('No query provided');

    const { query, model, prevMessage } = body;
    const messageWithContext = addSimpleContext(query);


    const messages = getSimpleMessages(messageWithContext, prevMessage);

    return getGPTResponse(messages, model);
  }
  catch (e) { return new Response('Invalid input, ' + e.message, { status: 400 }) }

}