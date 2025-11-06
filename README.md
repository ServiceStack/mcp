# ServiceStack MCP Server

Launches an MCP Server that creates an MCP Server for the APIs defined in the specififed configuration file.

Specifying the app.json metadata configuration file will create an MCP Server for all APIs defined in the app.json file.


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

