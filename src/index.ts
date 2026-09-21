import { input } from "@inquirer/prompts";
import { createAgent, HumanMessage } from "langchain";
import model from './model.js';
import { tools } from './tools.js';
import { buildSystemPrompt } from './systemPrompt.js';
import { readIfExists, isQuitCommand, isResetCommand } from './utils.js';
import { gammaTools } from './mcp.js';
import { loadHistory, saveHistory, clearHistory } from './history.js';

const existingIndexHtml = await readIfExists('index.html')
const existingStylesCss = await readIfExists('styles.css')

const landingPageAgent = createAgent({
    model,
    tools: [...tools, ...gammaTools],
    systemPrompt: buildSystemPrompt(existingIndexHtml, existingStylesCss)
})

let messages = await loadHistory()

if (messages.length > 0) {
    console.log(`Resumed previous conversation (${messages.length} messages). Type /new to start fresh.`)
}

while (true) {
    const prompt = await input({
        message: 'Your prompt: '
    })

    if (isQuitCommand(prompt)) {
        console.log('Goodbye!')
        break
    }

    if (isResetCommand(prompt)) {
        messages = []
        await clearHistory()
        console.log('Conversation history cleared.')
        continue
    }

    messages.push(new HumanMessage(prompt))
    const result = await landingPageAgent.invoke({
        messages
    })

    messages = result.messages
    await saveHistory(messages)

    console.log(result.messages.at(-1)?.content);

}
