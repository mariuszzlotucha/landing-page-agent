import { input } from "@inquirer/prompts";
import { BaseMessage, createAgent, HumanMessage } from "langchain";
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path';
import model from './model.js';
import { tools } from './tools.js';
import { buildSystemPrompt } from './systemPrompt.js';

const readIfExists = (filename: string) =>
    readFile(resolve(process.cwd(), filename), 'utf-8').catch(() => null)

const existingIndexHtml = await readIfExists('index.html')
const existingStylesCss = await readIfExists('styles.css')

const landingPageAgent = createAgent({
    model,
    tools,
    systemPrompt: buildSystemPrompt(existingIndexHtml, existingStylesCss)
})

let messages: BaseMessage[] = []

while (true) {
    const prompt = await input({
        message: 'Your prompt: '
    })
    messages.push(new HumanMessage(prompt))
    const result = await landingPageAgent.invoke({
        messages
    })

    messages = result.messages

    console.log(result.messages.at(-1)?.content);

}
