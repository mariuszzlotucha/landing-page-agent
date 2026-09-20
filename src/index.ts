import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

const model = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'openrouter/free',
    temperature: 0.7,
    configuration: {
        baseURL: 'https://openrouter.ai/api/v1'
    }

})

const landingPageAgent = createAgent({
    model,
    tools: [],
    systemPrompt: 'You are web designer and developer who creates clear, conversion-focued landing pages'
})

