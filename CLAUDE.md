This Launches an MCP Server that creates an MCP Server for the APIs defined in the specififed configuration file.

Specifying the `app.json` metadata configuration file will create an MCP Server for all APIs defined in the app.json file.

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