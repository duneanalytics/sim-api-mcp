// Tool Descriptions organized by category for easy review and iteration

export const TOOL_DESCRIPTIONS = {
  evm: {
    getBalances: {
      title: "Get Token Balances",
      description: "Retrieve token balances for a specified wallet address across EVM blockchains. Returns normalized, real-time data with enriched metadata and USD pricing."
    },
    getEVMTransactions: {
      title: "Get EVM Transactions",
      description: "Retrieve transactions for a given wallet address across EVM chains. Returns comprehensive transaction data including block information, gas details, and transaction status."
    },
    getTokenPrice: {
      title: "Get Token Price",
      description: "Get the current USD price for a specified token contract address. Supports filtering by chain IDs with default coverage across all supported chains."
    },
    listSupportedChainsTransactions: {
      title: "List Supported Chains (Transactions)",
      description: "List all blockchain networks supported by the Sim Transactions API. Returns an array of chain objects with chain IDs, names, and tags."
    },
    listSupportedChainsTokenBalances: {
      title: "List Supported Chains (Balances)",
      description: "List all blockchain networks supported by the Sim Token Balances API. Returns an array of chain objects with chain IDs, names, and tags."
    }
  },
  svm: {
    getSVMBalances: {
      title: "Get Solana Token Balances",
      description: "Retrieve token balances for a Solana wallet address (SVM). Returns balance data with USD values, supporting filtering by mint addresses and spam token exclusion."
    },
    getSVMTransactions: {
      title: "Get Solana Transactions",
      description: "Fetch transactions for a Solana wallet address on the Solana Virtual Machine (SVM). Returns comprehensive transaction data including signatures, block information, success status, and fees."
    }
  }
} as const;
