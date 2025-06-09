#!/usr/bin/env node

import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { localMcpServer } from "./server";
import { randomUUID } from "crypto";

// Store for active transports
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const app = new Koa();
const router = new Router({ prefix: "/mcp" });

router.use(bodyParser());

// Global error handler for Koa
app.on('error', (err, ctx) => {
  console.error('Server error:', err);
});

// Helper function to handle MCP requests
const handleMcpRequest = async (ctx: Koa.Context) => {
  try {
    const sessionId = ctx.headers["mcp-session-id"] as string;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
      console.error(`Reusing existing session: ${sessionId}`);
    } else {
      // Create new connection - either no sessionId provided or sessionId doesn't exist
      console.error(`Creating new session. Provided sessionId: ${sessionId || 'none'}`);
      
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId || randomUUID(),
        onsessioninitialized: (newSessionId) => {
          transports[newSessionId] = transport;
          console.error(`MCP session initialized: ${newSessionId}`);
        },
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          console.error(`MCP session closed: ${transport.sessionId}`);
          delete transports[transport.sessionId];
        }
      };

      await localMcpServer.connect(transport);
    }

    // Handle the request using the transport
    await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
    ctx.respond = false;
  } catch (error: any) {
    console.error('Error handling MCP request:', error);
    ctx.status = 500;
    ctx.body = `Internal server error: ${error.message}`;
  }
};

// Handle all MCP traffic (GET, POST, DELETE)
router.all("/", handleMcpRequest);

// Add SSE endpoint for compatibility
router.all("/sse", handleMcpRequest);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.error(`Sim API MCP Server running on port ${PORT}`);
  console.error(`MCP endpoint: http://localhost:${PORT}/mcp`);
});

// Handle uncaught exceptions to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 