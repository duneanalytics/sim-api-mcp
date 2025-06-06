# Sim API MCP Tool Descriptions - Updated Todo

## ✅ Completed
- [x] Fixed URL endpoints from `api.dune.com` to `api.sim.dune.com` in `src/functions/sim/sim.ts`
- [x] Fixed authentication header from `X-Dune-Api-Key` to `X-Sim-Api-Key`
- [x] Fixed typo `Sim_API_KEY` to `SIM_API_KEY`
- [x] Created MCP tool definition framework in `src/tools/tool.ts`
- [x] Added TypeScript interfaces for MCP tool structure
- [x] Created helper functions (`defineTool`, `defineReadOnlyTool`, `defineAPITool`)
- [x] Created reusable `CommonProperties` for consistent parameter definitions
- [x] Create new MCP tool definitions in `src/tools/sim.ts` using the framework
- [x] All EVM Tools converted with proper MCP structure
- [x] All SVM Tools converted with proper MCP structure
- [x] Applied MCP annotations strategy (readOnlyHint, destructiveHint, openWorldHint, idempotentHint)
- [x] Fixed function name mismatches (getBalance → getBalances, getLatestEVMActivity → getEVMActivity)
- [x] Added proper parameter validation and JSON schemas
- [x] Implemented consistent error handling across all tools
- [x] Replace `src/tools/descriptions.ts` with structured MCP tool implementations
- [x] Restructured `descriptions.ts` with organized categories (EVM/SVM) for easy review and iteration
- [x] Updated `sim.ts` to import descriptions from `descriptions.ts` for better maintainability
- [x] Update `src/tools/index.ts` to export the new Sim MCP tools
- [x] **Fixed test file** - Updated imports, API keys, URLs, and headers in `sim.test.ts`
- [x] **Added .gitignore** - Proper exclusion of .env and other sensitive files
- [x] **Made package.json generalizable** - Added bin entry for global installation
- [x] **Updated README** - Clear installation and usage instructions
- [x] **Working MCP server** - Server runs and responds to MCP protocol properly

## 🚧 High Priority - MCP Tool Integration 

## Project Setup
- [x] Create `src/index.ts` entrypoint with Koa and StreamableHTTPServerTransport
- [x] Create `package.json`
- [x] Add all dependencies
 
## Tool-by-Tool Conversion

### EVM Tools
- [x] **getBalances** 
  - Use `defineAPITool` framework
  - Parameters: `address` (required), `chain_ids`, `exclude_spam_tokens`
  - Title: "Get Token Balances"
  - Fix name from `getBalance` → `getBalances`

- [x] **getEVMTransactions**
  - Use `defineAPITool` framework  
  - Parameters: `address` (required), `chain_ids`, `limit`, `after_block_number`, `after_timestamp`, `tx_hash`
  - Title: "Get EVM Transactions"
  - Remove non-existent `decode` parameter

- [x] **getEVMActivity**
  - Use `defineAPITool` framework
  - Parameters: `address` (required), `chain_ids`, `limit`, `after_block_number`, `after_timestamp`, `tx_hash`
  - Title: "Get EVM Activity"
  - Fix name from `getLatestEVMActivity` → `getEVMActivity`

- [x] **getTokenPrice**
  - Use `defineAPITool` framework
  - Parameters: `contract_address` (required), `chain_ids`
  - Title: "Get Token Price"
  - Note: Uses `/beta/tokens/evm/` endpoint

- [x] **listSupportedChainsTransactions**
  - Use `defineAPITool` framework
  - Parameters: None
  - Title: "List Supported Chains (Transactions)"
  - Set `idempotentHint: true`

- [x] **listSupportedChainsTokenBalances**
  - Use `defineAPITool` framework
  - Parameters: None  
  - Title: "List Supported Chains (Balances)"
  - Set `idempotentHint: true`

### SVM Tools
- [x] **getSVMBalances**
  - Use `defineAPITool` framework
  - Parameters: `address` (required), `mint_addresses`, `exclude_spam`
  - Title: "Get Solana Token Balances"

- [x] **getSVMTransactions**  
  - Use `defineAPITool` framework
  - Parameters: `address` (required), `limit`, `after_block_number`, `after_timestamp`, `tx_hash`
  - Title: "Get Solana Transactions"

## MCP Annotations Strategy
- [x] Apply `readOnlyHint: true` to all tools (they're all API queries)
- [x] Apply `destructiveHint: false` to all tools (no state modification)
- [x] Apply `openWorldHint: true` to all tools (external API interactions)
- [x] Apply `idempotentHint: true` to listing functions only

## Integration Tasks
- [ ] Update server registration in `src/server.ts` to use Zod schemas instead of JSON schemas
- [ ] Install dependencies: `npm install`
- [ ] Test MCP tool definitions with MCP Inspector
- [ ] Verify tool schemas match actual function parameters
- [ ] Ensure callback functions properly handle parameter mapping

## Documentation Cleanup
- [ ] Archive or remove old `src/tools/descriptions.ts` once migration is complete
- [ ] Update README if it references the old description format
- [ ] Document the new MCP tool definition pattern for future tools

## Validation
- [ ] Test each tool definition with sample inputs
- [ ] Verify JSON schemas validate correctly
- [ ] Ensure all required parameters are marked as required
- [ ] Check that optional parameters have sensible defaults

## Future Enhancements
- [ ] Add TypeScript build step for production
- [ ] Add CI/CD pipeline
- [ ] Add more comprehensive error handling
- [ ] Add request/response logging
- [ ] Add rate limiting
- [ ] Publish to npm registry