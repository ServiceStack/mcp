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

## Connecting to Claude Tools

### Claude Desktop App

To use this MCP server with the Claude Desktop app, add it to your Claude Desktop configuration file:

**On macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**On Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

**On Linux:** `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "servicestack": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/absolute/path/to/your/app.json"
      ]
    }
  }
}
```

For example, if your app.json is in your home directory:

```json
{
  "mcpServers": {
    "techstacks-api": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/Users/yourname/projects/techstacks/app.json",
        "--tag",
        "Posts"
      ]
    }
  }
}
```

After saving the configuration, restart Claude Desktop. The MCP server will appear in the MCP menu (click the 🔌 icon at the bottom of the chat window).

### Claude Code CLI

To use this MCP server with Claude Code, add it to your MCP settings file:

**Location:** `~/.config/claude-code/mcp_settings.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "servicestack": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/absolute/path/to/your/app.json"
      ]
    }
  }
}
```

Example with filtering options:

```json
{
  "mcpServers": {
    "my-api": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/home/user/projects/myapp/app.json",
        "--apis",
        "QueryPosts,CreatePost,UpdatePost"
      ]
    }
  }
}
```

After saving, restart Claude Code. You can verify the MCP server is connected by checking the MCP status in the CLI.

### Per-Project Configuration (Claude Code)

For project-specific MCP servers, create a `.mcp_settings.json` file in your project root:

```json
{
  "mcpServers": {
    "local-api": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "./app.json"
      ]
    }
  }
}
```

Claude Code will automatically load this configuration when working in that directory.

### Using with Other MCP Clients

Any MCP-compatible client can connect to this server using the stdio transport. The general pattern is:

```json
{
  "command": "npx",
  "args": ["mcp-apis", "/path/to/app.json"]
}
```

Or if you've installed globally:

```json
{
  "command": "mcp-apis",
  "args": ["/path/to/app.json"]
}
```

### Configuration Options

All command-line options work in MCP client configurations:

- **Filter by tag:**
  ```json
  "args": ["mcp-apis", "./app.json", "--tag", "Posts"]
  ```

- **Filter specific APIs:**
  ```json
  "args": ["mcp-apis", "./app.json", "--apis", "QueryPosts,CreatePost"]
  ```

- **Combine multiple filters:**
  ```json
  "args": ["mcp-apis", "./app.json", "--tag", "TechStacks", "--apis", "QueryPosts"]
  ```

### Example Usage in Claude

Once connected, you can interact with your ServiceStack APIs naturally:

```
You: "Get the post with ID 123"
Claude: [Uses the GetPost API to fetch post 123]

You: "Create a new post titled 'Hello World' in organization 1"
Claude: [Uses the CreatePost API with the provided parameters]

You: "Search for posts about TypeScript"
Claude: [Uses the QueryPosts API to search for relevant posts]
```

### Troubleshooting

If the MCP server doesn't appear:

1. **Verify the path:** Make sure the path to your `app.json` file is absolute, not relative
2. **Check the file exists:** Ensure your `app.json` file exists at the specified path
3. **Restart the client:** After updating the configuration, restart Claude Desktop or Claude Code
4. **Check logs:**
   - Claude Desktop: Check `~/Library/Logs/Claude/` (macOS) or equivalent on your OS
   - Claude Code: Look for MCP-related errors in the CLI output

