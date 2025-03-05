

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

  const CHUNK_DELIMITER = "\n\n";
  const getChunkParser = () => {
    let unProcessedText = "";
    const parser = (text: string) => {
      const isValidChunk = text.endsWith(CHUNK_DELIMITER);
      if (!isValidChunk) {
        unProcessedText += text;
        return "";
      }

      const totalText = unProcessedText + text;
      unProcessedText = "";

      const chunks = totalText.split(CHUNK_DELIMITER);
      const content = chunks.map(getContentFromChunk).join("");
      return content;
    };

    return parser;
  };

  export { getChunkParser };