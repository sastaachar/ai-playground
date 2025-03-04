import { askAi } from "../__server/open-ai.js";
import { allowCors } from "../__server/cors-handler.js";


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

    return askAi(body.query);       
  }
  catch (e) { return new Response('Invalid input, ' + e.message, { status: 400 }) }

}

export default allowCors(start);