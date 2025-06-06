#!/usr/bin/env node

import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { localMcpServer } from "./server.js";
import { randomUUID } from "crypto";

// Store for active transports
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const app = new Koa();
const router = new Router({ prefix: "/mcp" });

router.use(bodyParser());

// Helper function to handle MCP requests
const handleMcpRequest = async (ctx: Koa.Context) => {
  const sessionId = ctx.headers["mcp-session-id"] as string;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && ctx.method === "POST") {
    // New connection - create transport
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (newSessionId) => {
        transports[newSessionId] = transport;
      },
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    await localMcpServer.connect(transport);
  } else {
    ctx.status = 400;
    ctx.body = "Invalid or missing session ID";
    return;
  }

  // Handle the request using the transport
  await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
  ctx.respond = false;
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