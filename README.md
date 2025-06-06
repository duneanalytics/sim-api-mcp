# Sim API MCP Server

MCP (Model Context Protocol) server for Sim blockchain APIs, providing access to EVM and SVM transaction data, balances, and token information.

**📦 This project uses pnpm as the package manager**

## Installation

### Global Installation (Recommended)
```bash
npm install -g sim-api-mcp
```

### Or use with npx (no installation)
```bash
npx sim-api-mcp
```

## Setup

1. Get your Sim API key from [Sim API Console](https://console.sim.dune.com)

2. Set environment variable:
```bash
export SIM_API_KEY=your_api_key_here
```

## Usage with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "sim-api": {
      "command": "sim-api-mcp",
      "env": {
        "SIM_API_KEY": "your_api_key_here"
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