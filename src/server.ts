/**
 * MCP Server for ServiceStack APIs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import type { AppMetadata, Operation, Property } from './types.js';
import { callServiceStackApi } from './api-client.js';
import { typeToJsonSchema } from './utils.js';

export interface ServerOptions {
  metadata: AppMetadata;
  operations: Operation[];
}

/**
 * Create JSON schema for operation parameters
 */
function createParameterSchema(operation: Operation): any {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const prop of operation.request.properties) {
    const propName = prop.name.charAt(0).toLowerCase() + prop.name.slice(1);
    const jsonType = typeToJsonSchema(prop.type);

    const schema: any = {
      type: jsonType,
      description: `${prop.type}${prop.isRequired ? ' (required)' : ''}`,
    };

    // Handle arrays
    if (jsonType === 'array') {
      schema.items = { type: 'string' };
    }

    properties[propName] = schema;

    // Add to required if property is marked as required
    if (prop.isRequired) {
      required.push(propName);
    }
  }

  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

/**
 * Convert an operation to an MCP tool
 */
function operationToTool(operation: Operation): Tool {
  const inputSchema = createParameterSchema(operation);

  // Build description
  let description = `${operation.method} ${operation.request.name}`;

  if (operation.routes && operation.routes.length > 0) {
    description += `\nRoute: ${operation.routes[0].path}`;
  }

  if (operation.requiresAuth) {
    description += '\nRequires authentication';
  }

  if (operation.tags && operation.tags.length > 0) {
    description += `\nTags: ${operation.tags.join(', ')}`;
  }

  // Add request properties info
  if (operation.request.properties.length > 0) {
    description += '\n\nParameters:';
    operation.request.properties.forEach(prop => {
      description += `\n- ${prop.name}: ${prop.type}`;
    });
  }

  // Add response info
  if (operation.response.properties.length > 0) {
    description += '\n\nResponse:';
    operation.response.properties.forEach(prop => {
      description += `\n- ${prop.name}: ${prop.type}`;
    });
  }

  return {
    name: operation.request.name,
    description,
    inputSchema,
  };
}

/**
 * Create and run the MCP server
 */
export async function createServer(options: ServerOptions): Promise<void> {
  const { metadata, operations } = options;

  const server = new Server(
    {
      name: 'servicestack-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = operations.map(op => operationToTool(op));
    return { tools };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      // Find the operation
      const operation = operations.find(op => op.request.name === name);

      if (!operation) {
        throw new Error(`Unknown operation: ${name}`);
      }

      // Convert parameter names to match ServiceStack conventions (case-insensitive)
      const parameters: Record<string, any> = {};
      if (args) {
        for (const [key, value] of Object.entries(args)) {
          // Find matching property (case-insensitive)
          const prop = operation.request.properties.find(
            p => p.name.toLowerCase() === key.toLowerCase()
          );

          if (prop) {
            parameters[prop.name] = value;
          } else {
            // If no matching property found, use the key as-is
            parameters[key] = value;
          }
        }
      }

      // Check for bearer token in arguments
      const bearerToken = parameters.bearerToken || parameters.BearerToken;
      if (bearerToken) {
        delete parameters.bearerToken;
        delete parameters.BearerToken;
      }

      // Call the API
      const result = await callServiceStackApi({
        baseUrl: metadata.app.baseUrl,
        operation,
        parameters,
        bearerToken,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP protocol)
  console.error(`ServiceStack MCP Server running`);
  console.error(`Base URL: ${metadata.app.baseUrl}`);
  console.error(`Operations: ${operations.length}`);
}
