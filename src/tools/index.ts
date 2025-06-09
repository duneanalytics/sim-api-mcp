import { Tool } from "@anthropic-ai/sdk/resources/messages";
import { simTools } from "./sim";

export const mcpTools = [
    ...simTools,
];

export const mcpToolsForApp: Tool[] = [
  ...simTools,
].map(
  (tool, index, array) =>
    ({
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: "object",
        properties: tool.inputSchema.properties,
      } satisfies Tool["input_schema"],
      ...(index === array.length - 1 && {
        cache_control: { type: "ephemeral" },
      }),
    }) satisfies Tool
);

export function getMcpTool(name: string) {
  return mcpTools.find((tool) => tool.name === name);
}
