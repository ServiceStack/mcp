#!/usr/bin/env node

/**
 * Main entry point for mcp-apis CLI
 */

import { parseCliArgs, loadAppMetadata, filterOperations } from './utils.js';
import { createServer } from './server.js';

async function main() {
  try {
    // Parse command line arguments (skip node and script paths)
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      console.log(`
ServiceStack MCP Server

Usage:
  npx mcp-apis <config-file|url> [options]

Arguments:
  config-file|url    Path to app.json metadata file or URL to ServiceStack API
                     URLs can be:
                     - Base URL: https://your-api.com (will fetch /metadata/app.json)
                     - Full metadata URL: https://your-api.com/metadata/app.json

Options:
  --tag <tag>           Filter APIs by tag
  --apis <api1,api2>    Filter specific APIs (comma-separated)
  --help, -h            Show this help message

Examples:
  # Local file
  npx mcp-apis ./app.json
  npx mcp-apis ./app.json --tag TechStacks

  # From URL (base URL)
  npx mcp-apis https://your-api.com
  npx mcp-apis https://localhost:5001 --tag Posts

  # From URL (full metadata path)
  npx mcp-apis https://your-api.com/metadata/app.json
  npx mcp-apis https://your-api.com/metadata/app.json --apis QueryPosts,CreatePost
      `);
      process.exit(0);
    }

    // Parse CLI options
    const options = parseCliArgs(args);

    // Load app metadata
    const metadata = await loadAppMetadata(options.configPath);

    // Filter operations based on options
    let operations = filterOperations(metadata.api.operations, options);

    if (operations.length === 0) {
      console.error('Error: No operations found matching the specified filters');
      process.exit(1);
    }

    // Log filter info to stderr
    if (options.tag) {
      console.error(`Filtered by tag: ${options.tag}`);
    }
    if (options.apis && options.apis.length > 0) {
      console.error(`Filtered by APIs: ${options.apis.join(', ')}`);
    }

    // Start the MCP server
    await createServer({ metadata, operations });

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
