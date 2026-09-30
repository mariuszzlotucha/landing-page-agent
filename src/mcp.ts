import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const gammaApiKey = process.env.GAMMA_API_KEY

export const mcpClient = gammaApiKey
    ? new MultiServerMCPClient({
        mcpServers: {
            gamma: {
                transport: "http",
                url: "https://mcp.leocode.ai/gamma/mcp",
                headers: { "X-Authorization": gammaApiKey },
            },
        },
    })
    : null

export const gammaTools = mcpClient
    ? await mcpClient.getTools().catch((error) => {
        console.warn(`Gamma unavailable, starting without it: ${error instanceof Error ? error.message : error}`)
        return []
    })
    : []
