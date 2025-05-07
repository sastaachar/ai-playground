import { config } from "../../server/constants";

type OnyxResponse = {
  chat_session_id: string;
}

export const createChatSession = async (): Promise<OnyxResponse> => {

  const createChatSessionLink = `https://spotgpt.thoughtspot.dev/api/chat/create-chat-session`;

  const response = await fetch(createChatSessionLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      persona_id: 12,
    })
  })
  const data = await response.json();
  console.log("Created chat session", data.chat_session_id);
  return data;
}


const getOnyxResponse = async ({ query, chatSessionId, parentMessageId = null }: { query: string, chatSessionId?: string, parentMessageId?: number }) => {
  if (!chatSessionId) {
    console.log("Creating new chat session");
    const response = await createChatSession();
    chatSessionId = response.chat_session_id;
  }


  const sendMessageLink = `https://spotgpt.thoughtspot.dev/api/chat/send-message`;
  return fetch(sendMessageLink, {
    "headers": {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({
      alternate_assistant_id: 12,
      chat_session_id: chatSessionId,
      parent_message_id: null,
      message: query,
      llm_override: {
        model_provider: "openai",
        model_version: "gpt-4o"
      },
      prompt_id: 13,
      search_doc_ids: null,
      file_descriptors: [],
      retrieval_options: {
        run_search: "auto",
        real_time: true,
        filters: {
          source_type: null,
          document_set: null,
          time_cutoff: null,
          tags: []
        }
      }
    }),
  });
}



export { getOnyxResponse };
