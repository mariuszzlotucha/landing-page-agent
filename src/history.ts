import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { BaseMessage } from 'langchain'
import {
    mapChatMessagesToStoredMessages,
    mapStoredMessagesToChatMessages,
    StoredMessage
} from '@langchain/core/messages'

const HISTORY_PATH = resolve(process.cwd(), '.landing-agent', 'history.json')

export async function loadHistory(): Promise<BaseMessage[]> {
    const raw = await readFile(HISTORY_PATH, 'utf-8').catch(() => null)
    if (!raw) return []

    const stored: StoredMessage[] = JSON.parse(raw)
    return mapStoredMessagesToChatMessages(stored)
}

export async function saveHistory(messages: BaseMessage[]): Promise<void> {
    const stored = mapChatMessagesToStoredMessages(messages)
    await mkdir(dirname(HISTORY_PATH), { recursive: true })
    await writeFile(HISTORY_PATH, JSON.stringify(stored, null, 2), 'utf-8')
}

export async function clearHistory(): Promise<void> {
    await rm(HISTORY_PATH, { force: true })
}
