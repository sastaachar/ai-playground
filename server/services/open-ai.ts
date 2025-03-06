import { config } from "../constants.js";
import { Message } from "../types.js";




export const askAi = (query: string) => {

  const model = config.AI.MODEL;
  const apiLink = config.AI.CREDS[model].API_LINK;
  const apiKey = config.AI.CREDS[model].API_KEY;

  if (!apiLink || !apiKey) {
    throw new Error("Invalid API credentials");
  }

  return fetch(apiLink, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
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
      temperature: config.AI.PARAMS.TEMPERATURE,
      top_p: config.AI.PARAMS.TOP_P,
      presence_penalty: config.AI.PARAMS.PRESENCE_PENALTY,
      frequency_penalty: config.AI.PARAMS.FREQUENCY_PENALTY,
      stream: config.AI.STREAM,
    }),
    method: "POST",
  });
}

type GPTOptions = {
  model?: string;
}

export const getGPTResponse = (messages: Message[], options: GPTOptions = {}) => {

  const isValidModel = options.model && Object.keys(config.AI.CREDS).includes(options.model);
  
  const model = isValidModel ? options.model : config.AI.MODEL;

  const apiLink = config.AI.CREDS[model].API_LINK;
  const apiKey = config.AI.CREDS[model].API_KEY;
 
  return fetch(apiLink, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      'accept': 'text/event-stream',
    },
    body: JSON.stringify({
      messages,
      temperature: config.AI.PARAMS.TEMPERATURE,
      top_p: config.AI.PARAMS.TOP_P,
      presence_penalty: config.AI.PARAMS.PRESENCE_PENALTY,
      frequency_penalty: config.AI.PARAMS.FREQUENCY_PENALTY,
      stream: config.AI.STREAM,
    }),
    method: "POST",
  });
}

