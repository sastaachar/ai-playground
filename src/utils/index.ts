import { fetchEventSource } from "@microsoft/fetch-event-source";




const getGPTParser = () => {
  const DONE_TEXT = "[DONE]";
  const getContentFromChunk = (chunk: string) => {
    const jsonString = chunk.replace(/^data: /, "");
    if (jsonString === DONE_TEXT || !jsonString) return "";

    try {
      const json = JSON.parse(jsonString);
      return json.choices[0]?.delta.content;
    } catch {
      console.error("Error parsing Chunk:", jsonString);
      return "...";
    }
  };
  const GPT_CHUNK_DELIMITER = "\n\n";
  let unProcessedText = "";
  const parser = (text: string) => {
    const isValidChunk = text.endsWith(GPT_CHUNK_DELIMITER);
    if (!isValidChunk) {
      unProcessedText += text;
      return "";
    }

    const totalText = unProcessedText + text;
    unProcessedText = "";

    const chunks = totalText.split(GPT_CHUNK_DELIMITER);
    const content = chunks.map(getContentFromChunk).join("");
    return content;
  };

  return parser;
}

const getOnyxParser = () => {

  const getContentFromChunk = (chunk: string) => {
    try {
      return JSON.parse(chunk).answer_piece;
    } catch {
      return "";
    }
  }

  const ONYX_CHUNK_DELIMITER = "\n";
  let unProcessedText = "";
  const parser = (text: string) => {

    console.log(text, "text", text.split(ONYX_CHUNK_DELIMITER))
    const isValidChunk = text.endsWith(ONYX_CHUNK_DELIMITER);
    if (!isValidChunk) {
      unProcessedText += text;
      return "";
    }

    const totalText = unProcessedText + text;
    unProcessedText = "";

    const chunks = totalText.split(ONYX_CHUNK_DELIMITER);
    const content = chunks.map(getContentFromChunk).join("");
    return content;
  };

  return parser;
}

const getChunkParser = (model?: string) => {
  if (model === 'onyx') {
    return getOnyxParser();
  }
  return getGPTParser();
};

export { getChunkParser };

export const createSSEStreamForAiApi = (url, body) => {
  const encoder = new TextEncoder();

  const controller = new AbortController();
  const { signal } = controller;

  const stream = new ReadableStream({
    start(controller) {

      fetchEventSource(url, {
        body,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        onmessage: (e) => {
          try {
            console.log(e.data, "e")
            controller.enqueue(encoder.encode(e.data))
          } catch (e) {
            console.error(e);
          }
        },
        onclose: () => {
          controller.close(); // End the stream
        },
        onerror: (e) => {
          controller.close(); // End the stream
          throw new Error(e)
        },
        signal,
      });

    },
    cancel: () => {
      controller.abort();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
};
