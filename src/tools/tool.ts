// MCP Tool Definition Types and Helper Functions

export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export interface JSONSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: JSONSchemaProperty;
  minimum?: number;
  maximum?: number;
  default?: any;
}

export interface ToolInputSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: ToolInputSchema;
  annotations?: ToolAnnotations;
  callback: (args: any) => Promise<any>;
}

export interface ToolDefinitionOptions {
  name: string;
  description?: string;
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  callback: (args: any) => Promise<any>;
}

/**
 * Define an MCP tool with proper schema structure
 */
export function defineTool(
  options: ToolDefinitionOptions,
  properties: Record<string, JSONSchemaProperty>,
  required?: string[]
): MCPTool {
  const {
    name,
    description,
    title,
    readOnlyHint = false,
    destructiveHint = true,
    idempotentHint = false,
    openWorldHint = true,
    callback
  } = options;

  return {
    name,
    description,
    inputSchema: {
      type: "object",
      properties,
      ...(required && required.length > 0 && { required }),
      additionalProperties: false
    },
    annotations: {
      ...(title && { title }),
      readOnlyHint,
      destructiveHint,
      idempotentHint,
      openWorldHint
    },
    callback
  };
}

/**
 * Helper for creating read-only tools (common pattern for API queries)
 */
export function defineReadOnlyTool(
  options: Omit<ToolDefinitionOptions, 'readOnlyHint' | 'destructiveHint'>,
  properties: Record<string, JSONSchemaProperty>,
  required?: string[]
): MCPTool {
  return defineTool(
    {
      ...options,
      readOnlyHint: true,
      destructiveHint: false
    },
    properties,
    required
  );
}

/**
 * Helper for creating API query tools that interact with external services
 */
export function defineAPITool(
  options: Omit<ToolDefinitionOptions, 'readOnlyHint' | 'destructiveHint' | 'openWorldHint'>,
  properties: Record<string, JSONSchemaProperty>,
  required?: string[]
): MCPTool {
  return defineTool(
    {
      ...options,
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true
    },
    properties,
    required
  );
}

/**
 * Common property definitions for reuse
 */
export const CommonProperties = {
  address: {
    type: "string",
    description: "Wallet or contract address (hexadecimal format)"
  },
  chainIds: {
    type: "array",
    description: "List of blockchain chain IDs to filter by",
    items: { type: "string" }
  },
  chainIdsString: {
    type: "string", 
    description: "Comma-separated chain IDs or 'all' for all chains"
  },
  limit: {
    type: "number",
    description: "Maximum number of results to return",
    minimum: 1,
    maximum: 1000,
    default: 10
  },
  excludeSpam: {
    type: "boolean",
    description: "Whether to exclude spam tokens from results",
    default: true
  },
  afterBlockNumber: {
    type: "number",
    description: "Return results after this block number",
    minimum: 0
  },
  afterTimestamp: {
    type: "number", 
    description: "Return results after this Unix timestamp",
    minimum: 0
  },
  txHash: {
    type: "string",
    description: "Filter by specific transaction hash"
  },
  contractAddress: {
    type: "string",
    description: "Token contract address"
  },
  mintAddresses: {
    type: "array",
    description: "List of Solana token mint addresses",
    items: { type: "string" }
  },
  offset: {
    type: "string",
    description: "Pagination offset from previous response"
  }
} as const;
