import { AI_MODEL } from "./types.js";

/**
 * @property {number} TEMPERATURE - Controls randomness in AI responses.
 *   - Higher values (e.g., 0.8-1.0): More creative and unpredictable responses.
 *   - Lower values (e.g., 0.1-0.3): More deterministic and focused responses.
 * 
 * @property {number} TOP_P - Regulates diversity in token selection using "nucleus sampling."
 *   - Higher values (~1.0): AI considers a wider range of words, increasing creativity.
 *   - Lower values (~0.1): AI chooses from a smaller subset of highly probable words, making responses more focused.
 * 
 * @property {number} PRESENCE_PENALTY - Adjusts the AI’s tendency to introduce new topics.
 *   - Higher values (~1.0): AI is encouraged to introduce new ideas.
 *   - Lower values (~0.0): AI may repeat topics more frequently.
 * 
 * @property {number} FREQUENCY_PENALTY - Reduces the likelihood of word repetition.
 *   - Higher values (~1.0): AI avoids repeating words or phrases.
 *   - Lower values (~0.0): AI may repeat words more often.
 */
export const config = {
  AI: {
    PARAMS: {
      TEMPERATURE: Number(process.env.AI_TEMPERATURE) || 0.3,
      TOP_P: Number(process.env.AI_TOP_P) || 0.3,
      PRESENCE_PENALTY: Number(process.env.AI_PRESENCE_PENALTY) || 0,
      FREQUENCY_PENALTY: Number(process.env.AI_FREQUENCY_PENALTY) || 0,
    },
    MODEL: process.env.AI_MODEL || AI_MODEL.GPT_4O_MINI,
    CREDS: {
      [AI_MODEL.GPT_4O_MINI]: {
        API_LINK: process.env.AI_API_LINK_4O_MINI || '',
        API_KEY: process.env.AI_API_KEY_4O_MINI || '',
      },
      [AI_MODEL.GPT_4O]: {
        API_LINK: process.env.AI_API_LINK_4O || '',
        API_KEY: process.env.AI_API_KEY_4O || '',
      },
      [AI_MODEL.GPT_O1]: {
        API_LINK: process.env.AI_API_LINK_O1 || '',
        API_KEY: process.env.AI_API_KEY_O1 || '',
      },
      [AI_MODEL.GPT_O1_MINI]: {
        API_LINK: process.env.AI_API_LINK_O1_MINI || '',
        API_KEY: process.env.AI_API_KEY_O1_MINI || '',
      },
      [AI_MODEL.GPT_O3_MINI]: {
        API_LINK: process.env.AI_API_LINK_O3_MINI || '',
        API_KEY: process.env.AI_API_KEY_O3_MINI || '',
      },
    },
    STREAM: process.env.AI_STREAM === 'true',
  },
} as const;