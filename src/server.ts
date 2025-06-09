import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpTools } from "./tools";

function definelocalMcpServer() {
  console.error("Starting MCP server initialization...");
  
  const localMcpServer = new McpServer(
    {
      name: "sim-api-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  console.error(`Total tools to register: ${mcpTools.length}`);

  // Convert JSON Schema properties to Zod schema
  function createZodSchema(properties: Record<string, any>, required: string[] = []): Record<string, any> {
    const zodSchema: Record<string, any> = {};
    
    // Handle empty properties case
    if (Object.keys(properties).length === 0) {
      return {};
    }
    
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
    
    console.error(`Registering tool: ${tool.name}`);
    
    localMcpServer.tool(
      tool.name,
      tool.description || "",
      zodSchema,
      async (args) => {
        console.error(`Tool ${tool.name} called with args:`, JSON.stringify(args, null, 2));
        try {
          const result = await tool.callback(args);
          console.error(`Tool ${tool.name} result:`, JSON.stringify(result, null, 2));
          return result;
        } catch (error: any) {
          console.error(`Error in tool ${tool.name}:`, error);
          const errorResult = {
            content: [
              {
                type: "text",
                text: `Error: ${error.message || 'Unknown error occurred'}`
              }
            ],
            isError: true
          };
          console.error(`Tool ${tool.name} error result:`, JSON.stringify(errorResult, null, 2));
          return errorResult;
        }
      }
    );
  }

  console.error("MCP server initialization complete");
  return localMcpServer;
}

export const localMcpServer = definelocalMcpServer();
