import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        gamma: {
            transport: "http",
            url: "https://mcp.leocode.ai/gamma/mcp",
            headers: { "X-Authorization": process.env.GAMMA_API_KEY! },
        },
    },
});

export const gammaTools = await mcpClient.getTools();
