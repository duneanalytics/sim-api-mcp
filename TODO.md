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
- [x] Fixed function name mismatches (getBalance → getBalances)
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
- [x] **Created src/index.ts entrypoint** - Koa server with StreamableHTTPServerTransport
- [x] **Created package.json** - With all necessary dependencies and scripts
- [x] **Updated server registration** - Using Zod schemas with conversion from JSON schemas
- [x] **All dependencies installed** - Package working with pnpm
- [x] **Tests passing** - All 24 tests pass successfully
- [x] **Server starts successfully** - MCP server runs on port 3000
- [x] **Removed getEVMActivity** - Non-existent API endpoint removed from codebase
- [x] **Reviewed tool alignment with sim.ts endpoints** - Verified all 7 endpoints have corresponding tools with proper implementation
- [x] **Updated SVM balances tool** - Aligned with OpenAPI spec using `/beta/svm/balances/{uri}` endpoint and `chains`, `limit`, `offset` parameters
- [x] **Updated SVM transactions tool** - Aligned with OpenAPI spec using `/beta/svm/transactions/{uri}` endpoint and `limit`, `offset` parameters only

## Tool-by-Tool Conversion - ✅ COMPLETED

### EVM Tools - All Completed ✅
- [x] **getBalances** - Using `defineAPITool` framework with proper parameters
- [x] **getEVMTransactions** - Using `defineAPITool` framework with proper parameters  
- [x] **getTokenPrice** - Using `defineAPITool` framework with proper parameters
- [x] **listSupportedChainsTransactions** - Using `defineAPITool` framework with idempotent hint
- [x] **listSupportedChainsTokenBalances** - Using `defineAPITool` framework with idempotent hint

### SVM Tools - All Completed ✅
- [x] **getSVMBalances** - Using `defineAPITool` framework with proper parameters
- [x] **getSVMTransactions** - Using `defineAPITool` framework with proper parameters

## MCP Annotations Strategy - ✅ COMPLETED
- [x] Applied `readOnlyHint: true` to all tools (they're all API queries)
- [x] Applied `destructiveHint: false` to all tools (no state modification)
- [x] Applied `openWorldHint: true` to all tools (external API interactions)
- [x] Applied `idempotentHint: true` to listing functions only

## 🚧 Remaining Tasks

### Testing & Validation
- [ ] Test MCP tool definitions with MCP Inspector
- [ ] Verify tool schemas match actual function parameters in real MCP client
- [ ] Test each tool definition with sample inputs in MCP environment
- [ ] Verify JSON schemas validate correctly in MCP context
- [ ] Ensure all required parameters are marked as required in MCP client
- [ ] Check that optional parameters have sensible defaults in MCP client

### Documentation & Cleanup
- [x] **Document the new MCP tool definition pattern for future tools** - Created comprehensive guide in `docs/MCP_TOOL_PATTERN.md`

### Production Readiness
- [x] **Add TypeScript build step for production** - Not needed for local MCP server (uses tsx for development)
- [ ] Add CI/CD pipeline
- [ ] Add more comprehensive error handling for edge cases
- [ ] Add request/response logging
- [ ] Add rate limiting
- [ ] Publish to npm registry

### Optional Enhancements
- [ ] Add support for pagination in tools that support it
- [ ] Add input validation beyond schema validation
- [ ] Add caching for expensive operations
- [ ] Add metrics and monitoring