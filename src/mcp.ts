import { MultiServerMCPClient } from "@langchain/mcp-adapters";

export const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        gamma: {
            transport: "http",
            url: "https://mcp.leocode.ai/gamma/mcp",
            headers: { "X-Authorization": process.env.GAMMA_API_KEY! },
        },
    },
});

export const gammaTools = process.env.GAMMA_API_KEY
    ? await mcpClient.getTools().catch((error) => {
        console.warn(`Gamma unavailable, starting without it: ${error instanceof Error ? error.message : error}`)
        return []
    })
    : []
