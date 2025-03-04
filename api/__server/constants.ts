if (!process.env.AI_API_LINK) {
  throw new Error('AI_API_LINK is not set');
}
if (!process.env.AI_API_KEY) {
  throw new Error('AI_API_KEY is not set');
}

export const config = {
  AI_PARAMS : {
    API_LINK: process.env.AI_API_LINK,
    MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
    TEMPERATURE: Number(process.env.AI_TEMPERATURE) ||  0.2,
    TOP_P: Number(process.env.AI_TOP_P) || 0.9,
    PRESENCE_PENALTY: Number(process.env.AI_PRESENCE_PENALTY) || 0.4,
    FREQUENCY_PENALTY: Number(process.env.AI_FREQUENCY_PENALTY) || 0.4,
    STREAM: Boolean(process.env.AI_STREAM) || true,
    API_KEY: process.env.AI_API_KEY || '',
  } 
}