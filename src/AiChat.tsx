import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const url = "http://localhost:3000/api/convo/ask";

const parseEventData = (data: string) => {
  // console.log(data)

  if (data === "[DONE]")
    return {
      done: true,
    };

  try {
    const obj = JSON.parse(data);
    console.log(obj);
    return {
      done: false,
      content: obj.choices?.[0]?.delta?.content as string,
    };
  } catch (e) {
    console.log("no partse", data);
  }
};

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
  console.log("i am called");
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
        content += chunk?.content || "";
        console.log(chunk.content)
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
      console.log("closed");
       },
    onerror: (e) => {
      console.log(e);
    },
    onopen: async () => {
      retries += 1;
      if(retries > 3) {
        onComplete?.();
        throw new Error("Failed to connect to the server");
      }
      console.log("opened");
    },
    signal,
  });

  return {
    abort: () => abortController.abort(),
  };
}

export const AiChat = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button
        onClick={async () => {
          setOutput("");
          streamOpenAI({
            query: input,
            onData: setOutput,
          })
        }}
      >
        Send
      </button>
      <p>{output}</p>
    </div>
  );
};
