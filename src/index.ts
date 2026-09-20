import { input } from "@inquirer/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

const model = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'openai/gpt-5.6-luna',
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

const prompt = await input({
    message: 'Your prompt: '
})

const result = await landingPageAgent.invoke({
    messages: [{
        role: 'user', content: prompt
    }]
})

console.log(result.messages.at(-1)?.content);
