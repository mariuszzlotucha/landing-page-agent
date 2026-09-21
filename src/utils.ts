import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const readIfExists = (filename: string) =>
    readFile(resolve(process.cwd(), filename), 'utf-8').catch(() => null)

const QUIT_COMMANDS = new Set(['exit', 'quit', ':q'])

export const isQuitCommand = (prompt: string) =>
    QUIT_COMMANDS.has(prompt.trim().toLowerCase())

const RESET_COMMANDS = new Set(['/new', '/reset'])

export const isResetCommand = (prompt: string) =>
    RESET_COMMANDS.has(prompt.trim().toLowerCase())
