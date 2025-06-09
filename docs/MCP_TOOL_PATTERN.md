# MCP Tool Definition Pattern

This document outlines the standardized pattern for creating Model Context Protocol (MCP) tools in this project. This pattern ensures consistency, type safety, and proper integration with MCP clients.

## Architecture Overview

The MCP tool definition pattern consists of three main components:

1. **Tool Definition Framework** (`src/tools/tool.ts`) - Core types and helper functions
2. **Tool Descriptions** (`src/tools/descriptions.ts`) - Centralized content management
3. **Tool Implementations** (`src/tools/sim.ts`) - Actual tool definitions using the framework

## Core Components

### 1. Tool Definition Framework (`src/tools/tool.ts`)

#### Key Types

```typescript
interface MCPTool {
  name: string;
  description?: string;
  inputSchema: ToolInputSchema;
  annotations?: ToolAnnotations;
  callback: (args: any) => Promise<any>;
}

interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}
```

#### Helper Functions

- **`defineTool()`** - Base function for creating any MCP tool
- **`defineReadOnlyTool()`** - For read-only operations (queries)
- **`defineAPITool()`** - For external API interactions (most common)

#### Common Properties

Pre-defined, reusable parameter definitions in `CommonProperties` object:

```typescript
const CommonProperties = {
  address: { type: "string", description: "Wallet or contract address" },
  limit: { type: "number", description: "Maximum results", default: 10 },
  excludeSpam: { type: "boolean", description: "Exclude spam tokens", default: true },
  // ... and more
}
```

### 2. Tool Descriptions (`src/tools/descriptions.ts`)

Centralized storage for all tool titles and descriptions, organized by category:

```typescript
export const TOOL_DESCRIPTIONS = {
  evm: {
    getBalances: {
      title: "Get Token Balances",
      description: "Retrieve token balances for a specified wallet address..."
    },
    // ... more EVM tools
  },
  svm: {
    getSVMBalances: {
      title: "Get Solana Token Balances", 
      description: "Retrieve token balances for a Solana wallet address..."
    },
    // ... more SVM tools
  }
} as const;
```

### 3. Tool Implementations (`src/tools/sim.ts`)

Actual tool definitions that combine the framework, descriptions, and business logic:

```typescript
export const getBalancesTool: MCPTool = defineAPITool(
  {
    name: "getBalances",
    description: TOOL_DESCRIPTIONS.evm.getBalances.description,
    title: TOOL_DESCRIPTIONS.evm.getBalances.title,
    callback: async (args) => {
      // Implementation logic
    }
  },
  {
    address: CommonProperties.address,
    chain_ids: CommonProperties.chainIdsString,
    exclude_spam_tokens: CommonProperties.excludeSpam
  },
  ["address"] // required parameters
);
```

## Creating New Tools

### Step 1: Add Description

Add your tool description to `src/tools/descriptions.ts`:

```typescript
export const TOOL_DESCRIPTIONS = {
  evm: {
    // ... existing tools
    myNewTool: {
      title: "My New Tool",
      description: "Detailed description of what this tool does..."
    }
  }
}
```

### Step 2: Choose the Right Helper Function

- **`defineAPITool()`** - For external API calls (most common)
- **`defineReadOnlyTool()`** - For read-only operations without external APIs
- **`defineTool()`** - For complete custom control

### Step 3: Define Parameters

Use `CommonProperties` when possible, or define custom properties:

```typescript
// Using common properties
{
  address: CommonProperties.address,
  limit: CommonProperties.limit
}

// Custom properties
{
  customParam: {
    type: "string",
    description: "My custom parameter",
    enum: ["option1", "option2"]
  }
}
```

### Step 4: Implement the Tool

```typescript
export const myNewTool: MCPTool = defineAPITool(
  {
    name: "myNewTool",
    description: TOOL_DESCRIPTIONS.evm.myNewTool.description,
    title: TOOL_DESCRIPTIONS.evm.myNewTool.title,
    callback: async (args) => {
      try {
        const result = await myApiFunction(args.param1, args.param2);
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {
    param1: CommonProperties.address,
    param2: { type: "string", description: "Custom parameter" }
  },
  ["param1"] // required parameters
);
```

### Step 5: Export the Tool

Add to the exports in `src/tools/sim.ts`:

```typescript
export const simTools: MCPTool[] = [
  // ... existing tools
  myNewTool
];
```

## MCP Annotations Strategy

### Standard Annotations for API Tools

```typescript
{
  readOnlyHint: true,      // All API queries are read-only
  destructiveHint: false,  // No state modification
  openWorldHint: true,     // External API interactions
  idempotentHint: false    // Most operations are not idempotent
}
```

### Special Cases

- **Listing functions** should set `idempotentHint: true` (e.g., `listSupportedChains`)
- **Destructive operations** should set `destructiveHint: true` and `readOnlyHint: false`

## Error Handling Pattern

All tools use the standardized `handleToolResult()` function:

```typescript
function handleToolResult(result: any) {
  if (result.error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${result.error}` }]
    };
  }
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
  };
}
```

## Best Practices

### Parameter Design
- Use `CommonProperties` for standard parameters
- Provide clear, descriptive parameter descriptions
- Set sensible defaults for optional parameters
- Mark required parameters in the required array

### Tool Naming
- Use camelCase for tool names
- Be descriptive but concise
- Follow the existing naming patterns

### Descriptions
- Keep descriptions informative but concise
- Explain what the tool returns
- Mention any important limitations or requirements

### Error Handling
- Always wrap API calls in try-catch
- Use the standard `handleToolResult()` pattern
- Provide meaningful error messages

## Integration with MCP Server

Tools are automatically registered with the MCP server through:

1. **Export** from `src/tools/sim.ts`
2. **Import** in `src/tools/index.ts` 
3. **Registration** in `src/server.ts` with Zod schema conversion

The server automatically converts JSON schemas to Zod schemas for MCP compatibility.

## Testing

Each tool should have corresponding tests in the function test files (e.g., `src/functions/sim/sim.test.ts`) that verify:

- Correct API endpoints are called
- Parameters are properly formatted
- Headers are correctly set
- Response handling works as expected

## Example: Complete Tool Implementation

```typescript
// 1. Add to descriptions.ts
export const TOOL_DESCRIPTIONS = {
  evm: {
    getWalletNFTs: {
      title: "Get Wallet NFTs",
      description: "Retrieve NFT collection for a wallet address with metadata and pricing."
    }
  }
}

// 2. Implement in sim.ts
export const getWalletNFTsTool: MCPTool = defineAPITool(
  {
    name: "getWalletNFTs",
    description: TOOL_DESCRIPTIONS.evm.getWalletNFTs.description,
    title: TOOL_DESCRIPTIONS.evm.getWalletNFTs.title,
    callback: async (args) => {
      try {
        const result = await getWalletNFTs(args.address, {
          chain_ids: args.chain_ids,
          include_metadata: args.include_metadata
        });
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {
    address: CommonProperties.address,
    chain_ids: CommonProperties.chainIdsString,
    include_metadata: {
      type: "boolean",
      description: "Include NFT metadata in response",
      default: true
    }
  },
  ["address"]
);

// 3. Add to exports
export const simTools: MCPTool[] = [
  getBalancesTool,
  getEVMTransactionsTool,
  // ... other tools
  getWalletNFTsTool
];
```

This pattern ensures consistency, maintainability, and proper MCP integration across all tools. 