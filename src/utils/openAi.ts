import { fetchEventSource } from "@microsoft/fetch-event-source";
import { AI_MODEL } from "../../server/types";
import { getOnyxResponse } from "../services/onyx";

const url = "/api/convo/ask";

async function streamOpenAI({
  query,
  onData,
  onChunk,
  onComplete,
}: {
  query: string;
  onData: (data: any) => void;
  onChunk?: (chunk: any) => void;
  onComplete?: () => void;
}) {
  const abortController = new AbortController();
  const { signal } = abortController;
  let content = "";
  let retries = 0;
  fetchEventSource(url, {
    body:
      JSON.stringify({
        query: query,
        messages: [{
          role: "system",
          content: "You are a helpful assistant to web developers, trying to embed Thoughtspot in their application.",
        }, {
          role: "user",
          content: `${query}`,
        }],
        model: 'onyx',
        temperature: 0,
        top_p: 0.9,
        presence_penalty: 0,
        frequency_penalty: 0,
        stream: true,
      }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    onmessage: (e) => {
      try {
        const chunk = parseEventData(e.data);
        content += chunk?.choices?.[0].delta?.content || "";
        onData(content);
        onChunk?.(chunk);

        if (chunk.done) {
          onComplete?.();
        }
      } catch (e) {
        console.error(e);
      }
    },
    onclose: () => {
    },
    onerror: (e) => {

      throw new Error("a")
    },
    onopen: async () => {
      retries += 1;
      if (retries > 3) {
        onComplete?.();
        throw new Error("Failed to connect to the server");
      }
    },
    signal,
  });

  return {
    abort: () => abortController.abort(),
  };
}

function parseEventData(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return { content: '', done: false };
  }
}

const askOnyx = ({ query, prevMessage, chatSessionId }: { query: string, prevMessage: any, chatSessionId?: string }) => {
  return getOnyxResponse({ query, chatSessionId });
}


const askApi = ({ query, prevMessage, model = AI_MODEL.ONYX, chatSessionId }: { query: string, prevMessage: any, model?: AI_MODEL, chatSessionId?: string }) => {

  const { host, token } = (window as any)._contentCache || {};
  const extraQuery = `Use ${host} as the thoughtspot host and use ${token} as the auth token for liveboardid use 9bd202f5-d431-44bf-9a07-b4f7be372125 `;

  if (model === AI_MODEL.ONYX) {
    return askOnyx({ query: query + extraQuery , prevMessage, chatSessionId })
  }

  const isDebug = window.location.href.includes('debug=true');

 
  return fetch(url, {
    body:
      JSON.stringify({
        query: query + extraQuery,
        direct: isDebug,
        prevMessage: prevMessage,
        model: model
      }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
};

// const askApi = async ({query, prevMessage, model = AI_MODEL.ONYX}: {query: string, prevMessage: any, model?: AI_MODEL}) => {
//   const isDebug = window.location.href.includes('debug=true');
//   return createSSEStreamForAiApi(url,  JSON.stringify({
//     query: query,
//     direct: isDebug,
//     prevMessage: prevMessage,
//     model: model
//   }))
// }



export { streamOpenAI, askApi };