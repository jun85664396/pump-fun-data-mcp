# Pump Fun Data MCP Server
[![smithery badge](https://smithery.ai/badge/@jun85664396/pump-fun-data-mcp)](https://smithery.ai/server/@jun85664396/pump-fun-data-mcp)

> Retrieve and manage coin data from Pump.fun efficiently.

A Model Context Protocol (MCP) server that provides data retrieval capabilities for Pump.fun coins.

**Note:** This is an unofficial API and is not affiliated with Pump.fun.

## Features

- Fetch a list of featured coins
- Retrieve a list of coins with sorting and ordering options
- Get detailed information about a specific coin

## Installation

### Installing via Smithery

To install `pump-fun-data-mcp` for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@jun85664396/pump-fun-data-mcp):

```bash
npx -y @smithery/cli@latest install @jun85664396/pump-fun-data-mcp --client claude
```

### Manual Installation

Add this to your MCP config:

```
    "pump-fun-data": {
      "command": "npx",
      "args": ["-y", "github:jun85664396/pump-fun-data-mcp"]
    }
```

### Installing via Docker

#### Build the Docker image:
```bash
docker build -t mcp/pump-fun-data -f Dockerfile .
```

#### Run with Docker:
```json
{
  "mcpServers": {
    "pump-fun-data": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init", "-e", "DOCKER_CONTAINER=true", "mcp/pump-fun-data"]
    }
  }
}
```

## API Methods

### 1. Get Featured Coins

Retrieve a list of featured coins.

#### Request Parameters:

| Parameter      | Type    | Description                                    | Default |
|--------------|--------|--------------------------------|---------|
| offset       | number | The offset to start from | 0 |
| limit        | number | The number of coins to return | 24 |
| includeNsfw  | boolean | Include NSFW coins | true |

#### Example Request:
```json
{
    "name": "get_featured_coins",
    "inputSchema": {
        "offset": 0,
        "limit": 24,
        "includeNsfw": true
    }
}
```

### 2. Get Coins

Retrieve a list of coins with sorting and ordering options.

#### Request Parameters:

| Parameter      | Type    | Description                                    | Default |
|--------------|--------|--------------------------------|---------|
| offset       | number | The offset to start from | 0 |
| limit        | number | The number of coins to return | 24 |
| sort         | string | The field to sort by (`market_cap`, `last_trade_timestamp`, `created_timestamp`, `last_reply`) | `market_cap` |
| includeNsfw  | boolean | Include NSFW coins | true |
| order        | string | The order to sort by (`ASC`, `DESC`) | `DESC` |

#### Example Request:
```json
{
    "name": "get_coins",
    "inputSchema": {
        "offset": 0,
        "limit": 24,
        "sort": "market_cap",
        "includeNsfw": true,
        "order": "DESC"
    }
}
```

### 3. Get Coin Info

Retrieve detailed information about a specific coin.

#### Request Parameters:

| Parameter      | Type    | Description                                    | Required |
|--------------|--------|--------------------------------|----------|
| mintId       | string | The mint ID (coin address) | Yes |

#### Example Request:
```json
{
    "name": "get_coin_info",
    "inputSchema": {
        "mintId": "some-mint-id"
    }
}
```

## License

This project is licensed under the MIT License.