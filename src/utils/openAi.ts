import { fetchEventSource } from "@microsoft/fetch-event-source";

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
          model: 'gpt-4o-mini',
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
          content += chunk?.choices?.[0].delta?.content|| "";
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
        if(retries > 3) {
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
  

const askApi = (query: string) => {
  return fetch(url, {
    body: 
       JSON.stringify({
        query: query,
      }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }});
};

export { streamOpenAI, askApi };