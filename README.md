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

## API Metadata

The list of available APIs is available under `api/operations` in the `app.json` file, e.g:

```json
{
    "app": {
        "baseUrl": "https://localhost:5001"
    },
    "api": {
        "operations": [
            {
                "request": {
                    "name": "GetPost",
                    "namespace": "TechStacks.ServiceModel",
                    "implements": [
                        {
                            "name": "IGet",
                            "namespace": "ServiceStack",
                            "genericArgs": []
                        }
                    ],
                    "properties": [
                        {
                            "name": "Id",
                            "type": "Int64",
                            "namespace": "System",
                            "isValueType": true,
                            "isPrimaryKey": true
                        },
                        {
                            "name": "Include",
                            "type": "String",
                            "namespace": "System"
                        }
                    ]
                },
                "response": {
                    "name": "GetPostResponse",
                    "namespace": "TechStacks.ServiceModel",
                    "implements": [],
                    "properties": [
                        {
                            "name": "Cache",
                            "type": "Int64",
                            "namespace": "System",
                            "isValueType": true
                        },
                        {
                            "name": "Post",
                            "type": "Post",
                            "namespace": "TechStacks.ServiceModel.Types"
                        },
                        {
                            "name": "Comments",
                            "type": "List\u00601",
                            "namespace": "System.Collections.Generic",
                            "genericArgs": [
                                "PostComment"
                            ]
                        },
                        {
                            "name": "ResponseStatus",
                            "type": "ResponseStatus",
                            "namespace": "ServiceStack"
                        }
                    ]
                },
                "actions": [
                    "GET"
                ],
                "method": "GET",
                "returnType": {
                    "name": "GetPostResponse",
                    "namespace": "TechStacks.ServiceModel"
                },
                "routes": [
                    {
                        "path": "/posts/{Id}",
                        "verbs": "GET"
                    }
                ],
                "tags": [
                    "Posts"
                ]
            },
            {
                "request": {
                    "name": "CreatePost",
                    "namespace": "TechStacks.ServiceModel",
                    "implements": [
                        {
                            "name": "IPost",
                            "namespace": "ServiceStack",
                            "genericArgs": []
                        }
                    ],
                    "properties": [
                        {
                            "name": "OrganizationId",
                            "type": "Int32",
                            "namespace": "System",
                            "isValueType": true
                        },
                        {
                            "name": "Type",
                            "type": "PostType",
                            "namespace": "TechStacks.ServiceModel.Types",
                            "isValueType": true,
                            "isEnum": true
                        },
                        {
                            "name": "CategoryId",
                            "type": "Int32",
                            "namespace": "System",
                            "isValueType": true
                        },
                        {
                            "name": "Title",
                            "type": "String",
                            "namespace": "System"
                        },
                        {
                            "name": "ImageUrl",
                            "type": "String",
                            "namespace": "System"
                        },
                        {
                            "name": "Content",
                            "type": "String",
                            "namespace": "System"
                        },
                        {
                            "name": "TechnologyIds",
                            "type": "Int32[]",
                            "namespace": "System"
                        }
                    ]
                },
                "response": {
                    "name": "CreatePostResponse",
                    "namespace": "TechStacks.ServiceModel",
                    "implements": [],
                    "properties": [
                        {
                            "name": "Id",
                            "type": "Int64",
                            "namespace": "System",
                            "isValueType": true,
                            "isPrimaryKey": true
                        },
                        {
                            "name": "Slug",
                            "type": "String",
                            "namespace": "System"
                        },
                        {
                            "name": "ResponseStatus",
                            "type": "ResponseStatus",
                            "namespace": "ServiceStack"
                        }
                    ]
                },
                "actions": [
                    "POST"
                ],
                "method": "POST",
                "returnType": {
                    "name": "CreatePostResponse",
                    "namespace": "TechStacks.ServiceModel"
                },
                "routes": [
                    {
                        "path": "/posts",
                        "verbs": "POST"
                    }
                ],
                "requiresAuth": true,
                "tags": [
                    "Posts"
                ]
            }
        ]
    }
}
```

## Invoking API

In ServiceStack, APIs are invoked by sending a Request DTO to the Server using:
 - the `baseUrl` defined in `app.json`
 - the `/api/{RequestName}` path
 - the HTTP Method defined in the API's `method`

Please Note:
- All parameter names are case-insensitive, although **camelCase** is recommended.
- Request DTOs are defined in `/api/operations[]/request`
- Response DTOs are defined in `/api/operations[]/response`
- All other Types and enums are defined in `/api/types[]`

1. For **GET** or **DELETE** requests any query string params are added to the URL, e.g:

```bash
GET /api/GetPost?id=1&include=comments
```

This will return the type in the **response**, e.g. the `GetPostResponse` Response DTO.

2. For **POST**, **PUT** or **PATCH** requests the Request DTO is sent in the Request Body defined in the `request`, e.g:

```bash
POST /api/CreatePost
Content-Type: application/json

{
    "organizationId": 1,
    "type": "Post",
    "title": "Hello World",
    "content": "This is my first Post!",
    "technologyIds": [1,2,3],
    "imageUrl": "https://example.com/bg.jpg"
}
```

This will return the type in the **response**, e.g. the `CreatePostResponse` Response DTO.

## Connecting with Claude Desktop

To use this MCP server with Claude Desktop, you need to configure it in your Claude Desktop configuration file.

### Configuration

The configuration file location depends on your operating system:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the following to your configuration file:

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

Replace `/absolute/path/to/your/app.json` with the actual path to your ServiceStack API metadata file.

### Filtering APIs

You can also filter which APIs are exposed to Claude by adding additional arguments:

#### Filter by Tag

```json
{
  "mcpServers": {
    "servicestack": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/absolute/path/to/your/app.json",
        "--tag",
        "Posts"
      ]
    }
  }
}
```

#### Filter by Specific APIs

```json
{
  "mcpServers": {
    "servicestack": {
      "command": "npx",
      "args": [
        "mcp-apis",
        "/absolute/path/to/your/app.json",
        "--apis",
        "QueryPosts,CreatePost,UpdatePost,DeletePost"
      ]
    }
  }
}
```

### After Configuration

1. Save the configuration file
2. Restart Claude Desktop
3. Look for the hammer icon (🔨) in Claude Desktop to confirm the MCP server is connected
4. You can now ask Claude to interact with your ServiceStack APIs!

## Example Usage with Claude

Once connected, you can ask Claude to interact with your APIs:

- "List all posts from my ServiceStack API"
- "Create a new post with the title 'Hello World'"
- "Get the post with ID 123"
- "Update post 456 with a new title"

Claude will automatically discover the available APIs, understand their schemas, and make the appropriate HTTP requests to your ServiceStack application.