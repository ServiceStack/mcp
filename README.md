# ServiceStack MCP Server

An MCP (Model Context Protocol) Server that enables Claude to interact with ServiceStack APIs. This tool transforms your ServiceStack API metadata into an MCP server, allowing Claude to discover and invoke your APIs through natural language.

## What is this?

This MCP server allows Claude to:
- Discover all available APIs from your ServiceStack application
- Understand the request/response schemas
- Invoke APIs with proper parameters
- Handle authentication when required

## Getting Your ServiceStack API Metadata

Before using this tool, you need to export your ServiceStack API metadata to an `app.json` file. ServiceStack automatically generates this metadata at the `/metadata/app.json` endpoint of your application.

### Download Your app.json

```bash
# Download from your ServiceStack application
curl https://your-api.com/metadata/app.json > app.json

# Or for local development
curl https://localhost:5001/metadata/app.json > app.json
```

## Quick Start

Once you have your `app.json` file, you can run the MCP server:

```bash
npx mcp-apis ./app.json
```

You can also filter the APIs to only include those with a specific tag, e.g:

```bash
npx mcp-apis ./app.json --tag TechStacks
```

Or a specific API:

```bash
npx mcp-apis ./app.json --apis QueryPost
```

Or multiple APIs:

```bash
npx mcp-apis ./app.json --apis QueryPosts,CreatePost,UpdatePost,DeletePost
```

