import { config } from "./constants.js";

export const askAi = (query: string) => {
  return fetch(config.AI_PARAMS.API_LINK, {
    headers: {
      "Content-Type": "application/json",
      "api-key": config.AI_PARAMS.API_KEY,
      'accept': 'text/event-stream',
    },
    body: JSON.stringify({
      messages: [{
        role: "system",
        content: "You are a helpful assistant to web developers, trying to embed Thoughtspot in their application.",
      }, {
        role: "user",
        content: `${query}`,
      }],
      model: config.AI_PARAMS.MODEL,
      temperature: config.AI_PARAMS.TEMPERATURE,
      top_p: config.AI_PARAMS.TOP_P,
      presence_penalty: config.AI_PARAMS.PRESENCE_PENALTY,
      frequency_penalty: config.AI_PARAMS.FREQUENCY_PENALTY,
      stream: config.AI_PARAMS.STREAM,
    }), 
    method: "POST",
  });
}

