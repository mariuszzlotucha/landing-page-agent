import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-5.6-luna',
    temperature: Number(process.env.OPENROUTER_TEMPERATURE ?? 0.7),
    configuration: {
        baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1'
    }
})

export default model;
