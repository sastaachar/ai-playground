import { createChatSession } from "../../services/onyx";

export const getStartChatSessionResponse = async () => {
  const response = await createChatSession();
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}