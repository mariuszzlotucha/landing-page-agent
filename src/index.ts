import { input } from "@inquirer/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import {tool} from '@langchain/core/tools'
import {writeFile} from 'node:fs/promises'
import {resolve} from 'node:path';
import {z } from 'zod';

const model = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'openai/gpt-5.6-luna',
    temperature: 0.7,
    configuration: {
        baseURL: 'https://openrouter.ai/api/v1'
    }

})

const saveIndexHtml = tool(
    async ({html}) => {
        const outputPath = resolve(process.cwd(), 'index.html')
        await writeFile(outputPath, html, 'utf-8')
        return `saved to ${outputPath}`
    }, {
        name: 'save_index_html',
        description: 'Save a complete landing page as index.html in the current project',
        schema: z.object({
            html: z.string().describe('The complete raw HTML document, including CSS and scripts')
        })
    }
)

const landingPageAgent = createAgent({
    model,
    tools: [saveIndexHtml],
    systemPrompt: 'You are web designer and developer who creates clear, conversion-focued landing pages. Generate a complete, self-contained HTML docuemnt based ont the users request. You must call save_index_html with finished HTML so it is written to disc as index.html. Do not wrap the HTML in Markdown fences'
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
