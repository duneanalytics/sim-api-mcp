# Sim API MCP Server

MCP (Model Context Protocol) server for Sim blockchain APIs, providing access to EVM and SVM transaction data, balances, and token information.

**📦 This project uses pnpm as the package manager**

## Installation

```bash
# Clone and install
git clone https://github.com/duneanalytics/sim-api-mcp.git
cd sim-api-mcp
pnpm install
```

## Setup

1. Get your Sim API key from [Sim API Console](https://sim.dune.com)

2. Set environment variable:
```bash
export SIM_API_KEY=your_api_key_here
```

3. Start the server:
```bash
pnpm run start
```

## Usage with Claude Desktop

First, start the server locally:
```bash
pnpm run start
```

Then add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "sim-api": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/mcp"
      ],
      "timeout": 30000,
      "reconnectDelay": 5000,
      "env": {
        "SIM_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

## Available Tools

### EVM Tools
- `getBalances` - Get token balances for EVM wallet addresses
- `getEVMTransactions` - Get transaction history for EVM addresses
- `getTokenPrice` - Get current USD prices for EVM tokens
- `listSupportedChainsTransactions` - List supported chains for transactions
- `listSupportedChainsTokenBalances` - List supported chains for balances

### SVM Tools
- `getSVMBalances` - Get token balances for Solana wallet addresses
- `getSVMTransactions` - Get transaction history for Solana addresses

## Development

**Note: This project uses pnpm for package management**

```bash
# Clone and install
git clone <repo-url>
cd sim-api-mcp
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test
```

## API Reference

Server runs on port 3000 by default. MCP endpoint: `http://localhost:3000/mcp` with Streamable HTTP