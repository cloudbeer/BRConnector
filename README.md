<div align="center">
<img src="./src/public/img/bedrock_32.svg" alt="icon"/>

<h1 align="center">BRProxy</h1>

English / [简体中文](./README_CN.md)

</div>

## Installation

Dev mode

```shell
npm run dev
# or
yarn dev
```

Prod mode

```shell
npm run build 
node dist/server/node.js

# or

yarn start
```


## Docker

Build Docker

Before you build docker, run  `npm run build` first.

Run directly:

```shell
docker run --name brproxy \
 -p 8866:8866 \
 -e AWS_ACCESS_KEY_ID=xxxx \
 -e AWS_SECRET_ACCESS_KEY=xxxxx \
 -e AWS_DEFAULT_REGION=us-east-1 \
 -e PGSQL_HOST=127.0.0.1 \
 -d cloudbeer/brproxy:0.0.3
```

## API Specification

### Chat API

```text
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "model": "claude-3-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "ping"
    }
  ],
  "stream": true,
  "temperature": 1,
  "max_tokens": 4096
}
```

### Manage API

Apply an api key

```text
POST /admin/api-key/apply
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "name": "jack",
  "group_id": 1,
  "role": "user",
  "email": ""
}
```

Apply an api key with admin role

```text
POST /admin/api-key/apply
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "name": "rob",
  "group_id": 1,
  "role": "admin",
  "email": ""
}
```
