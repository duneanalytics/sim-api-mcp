import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpTools } from "./tools";

function definelocalMcpServer() {
  const localMcpServer = new McpServer(
    {
      name: "sim-api-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  // Convert JSON Schema properties to Zod schema
  function createZodSchema(properties: Record<string, any>, required: string[] = []): Record<string, any> {
    const zodSchema: Record<string, any> = {};
    
    for (const [key, prop] of Object.entries(properties)) {
      let schema;
      
      switch (prop.type) {
        case 'string':
          schema = z.string();
          break;
        case 'number':
          schema = z.number();
          if (prop.minimum !== undefined) schema = schema.min(prop.minimum);
          if (prop.maximum !== undefined) schema = schema.max(prop.maximum);
          break;
        case 'boolean':
          schema = z.boolean();
          if (prop.default !== undefined) schema = schema.default(prop.default);
          break;
        case 'array':
          schema = z.array(z.string());
          break;
        default:
          schema = z.any();
      }
      
      // Make optional if not in required array
      if (!required.includes(key)) {
        schema = schema.optional();
      }
      
      zodSchema[key] = schema;
    }
    
    return zodSchema;
  }

  for (const tool of mcpTools) {
    const zodSchema = createZodSchema(
      tool.inputSchema.properties, 
      tool.inputSchema.required || []
    );
    
    localMcpServer.tool(
      tool.name,
      tool.description || "",
      zodSchema,
      tool.callback
    );
  }

  return localMcpServer;
}

export const localMcpServer = definelocalMcpServer();
