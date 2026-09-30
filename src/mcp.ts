import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const gammaApiKey = process.env.GAMMA_API_KEY

export const mcpClient = gammaApiKey
    ? new MultiServerMCPClient({
        mcpServers: {
            gamma: {
                transport: "http",
                url: process.env.GAMMA_MCP_URL ?? "https://mcp.leocode.ai/gamma/mcp",
                headers: { [process.env.GAMMA_AUTH_HEADER ?? "X-Authorization"]: gammaApiKey },
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
