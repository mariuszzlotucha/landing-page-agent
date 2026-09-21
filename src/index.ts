import { input } from "@inquirer/prompts";
import { BaseMessage, createAgent, HumanMessage } from "langchain";
import model from './model.js';
import { tools } from './tools.js';
import { buildSystemPrompt } from './systemPrompt.js';
import { readIfExists, isQuitCommand } from './utils.js';

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

    if (isQuitCommand(prompt)) {
        console.log('Goodbye!')
        break
    }

    messages.push(new HumanMessage(prompt))
    const result = await landingPageAgent.invoke({
        messages
    })

    messages = result.messages

    console.log(result.messages.at(-1)?.content);

}
