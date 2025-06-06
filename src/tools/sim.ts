import {
  defineAPITool,
  CommonProperties,
  MCPTool
} from "./tool";
import { TOOL_DESCRIPTIONS } from "./descriptions";
import {
  getBalances,
  getEVMTransactions,
  getTokenPrice,
  listSupportedChainsTransactions,
  listSupportedChainsTokenBalances,
  getSVMBalances,
  getSVMTransactions
} from "../functions/sim/sim";

// Helper function to handle API responses and errors
function handleToolResult(result: any) {
  if (result.error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${result.error}`
        }
      ]
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}

// EVM Tools
export const getBalancesTool: MCPTool = defineAPITool(
  {
    name: "getBalances",
    description: TOOL_DESCRIPTIONS.evm.getBalances.description,
    title: TOOL_DESCRIPTIONS.evm.getBalances.title,
    callback: async (args) => {
      try {
        const result = await getBalances(args.address, {
          chain_ids: args.chain_ids,
          exclude_spam_tokens: args.exclude_spam_tokens
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
    exclude_spam_tokens: CommonProperties.excludeSpam
  },
  ["address"]
);

export const getEVMTransactionsTool: MCPTool = defineAPITool(
  {
    name: "getEVMTransactions",
    description: TOOL_DESCRIPTIONS.evm.getEVMTransactions.description,
    title: TOOL_DESCRIPTIONS.evm.getEVMTransactions.title,
    callback: async (args) => {
      try {
        const result = await getEVMTransactions(args.address, {
          chain_ids: args.chain_ids,
          limit: args.limit,
          after_block_number: args.after_block_number,
          after_timestamp: args.after_timestamp,
          tx_hash: args.tx_hash
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
    limit: CommonProperties.limit,
    after_block_number: CommonProperties.afterBlockNumber,
    after_timestamp: CommonProperties.afterTimestamp,
    tx_hash: CommonProperties.txHash
  },
  ["address"]
);

export const getTokenPriceTool: MCPTool = defineAPITool(
  {
    name: "getTokenPrice",
    description: TOOL_DESCRIPTIONS.evm.getTokenPrice.description,
    title: TOOL_DESCRIPTIONS.evm.getTokenPrice.title,
    callback: async (args) => {
      try {
        const result = await getTokenPrice(args.contract_address, {
          chain_ids: args.chain_ids || "all"
        });
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {
    contract_address: CommonProperties.contractAddress,
    chain_ids: CommonProperties.chainIdsString
  },
  ["contract_address"]
);

export const listSupportedChainsTransactionsTool: MCPTool = defineAPITool(
  {
    name: "listSupportedChainsTransactions",
    description: TOOL_DESCRIPTIONS.evm.listSupportedChainsTransactions.description,
    title: TOOL_DESCRIPTIONS.evm.listSupportedChainsTransactions.title,
    idempotentHint: true,
    callback: async () => {
      try {
        const result = await listSupportedChainsTransactions();
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {},
  []
);

export const listSupportedChainsTokenBalancesTool: MCPTool = defineAPITool(
  {
    name: "listSupportedChainsTokenBalances",
    description: TOOL_DESCRIPTIONS.evm.listSupportedChainsTokenBalances.description,
    title: TOOL_DESCRIPTIONS.evm.listSupportedChainsTokenBalances.title,
    idempotentHint: true,
    callback: async () => {
      try {
        const result = await listSupportedChainsTokenBalances();
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {},
  []
);

// SVM Tools
export const getSVMBalancesTool: MCPTool = defineAPITool(
  {
    name: "getSVMBalances",
    description: TOOL_DESCRIPTIONS.svm.getSVMBalances.description,
    title: TOOL_DESCRIPTIONS.svm.getSVMBalances.title,
    callback: async (args) => {
      try {
        const result = await getSVMBalances(args.address, {
          chains: args.chains,
          limit: args.limit,
          offset: args.offset
        });
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {
    address: {
      type: "string",
      description: "Solana wallet address to check balances for"
    },
    chains: {
      type: "string",
      description: "Comma-separated list of chains to include, or 'all' for all supported chains"
    },
    limit: CommonProperties.limit,
    offset: CommonProperties.offset
  },
  ["address"]
);

export const getSVMTransactionsTool: MCPTool = defineAPITool(
  {
    name: "getSVMTransactions",
    description: TOOL_DESCRIPTIONS.svm.getSVMTransactions.description,
    title: TOOL_DESCRIPTIONS.svm.getSVMTransactions.title,
    callback: async (args) => {
      try {
        const result = await getSVMTransactions(args.address, {
          limit: args.limit,
          offset: args.offset
        });
        return handleToolResult(result);
      } catch (error: any) {
        return handleToolResult({ error: error.message });
      }
    }
  },
  {
    address: {
      type: "string",
      description: "Solana wallet address to check transactions for"
    },
    limit: CommonProperties.limit,
    offset: CommonProperties.offset
  },
  ["address"]
);

// Export all tools as an array
export const simTools: MCPTool[] = [
  getBalancesTool,
  getEVMTransactionsTool,
  getTokenPriceTool,
  listSupportedChainsTransactionsTool,
  listSupportedChainsTokenBalancesTool,
  getSVMBalancesTool,
  getSVMTransactionsTool
];
