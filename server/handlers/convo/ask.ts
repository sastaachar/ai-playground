import { addSimpleContext } from "../../context-provider/get-simple-context.js";
import { getSimpleMessages } from "../../message-creation/simple-message.js";
import { getOnyxResponse } from "../../services/onyx.js";
import { getGPTResponse } from "../../services/open-ai.js";

export async function ask(request: Request) {

  try {
    const body = await request.json();
    if (!body.query) throw new Error('No query provided');

    const { query, model, prevMessage, direct, chatSessionId } = body;

    if (model === 'onyx') {
      return getOnyxResponse({ query, chatSessionId, parentMessageId: prevMessage?.id });
    }

    if (direct) {
      // for debugging
      return getGPTResponse(
        getSimpleMessages(query, null, { direct }),
        { model }
      );
    }

    const messageWithContext = addSimpleContext(query);

    const messages = getSimpleMessages(messageWithContext, prevMessage);

    return getGPTResponse(messages, { model });
  }
  catch (e) { return new Response('Invalid input, ' + e.message, { status: 400 }) }

}