<div align="center">
<img src="./src/public/img/bedrock_32.svg" alt="icon"/>

<h1 align="center">BRProxy</h1>

English / [简体中文](./README_CN.md)

</div>

## Installation:

Dev mode

```bash
npm run dev
```


## API Specification

### Chat API

```### /v1/chat/completions
POST {{hostLocal}}/v1/chat/completions
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
  "max_tokens": 4096
}






```


### Manage API

Apply an api key

```
POST /admin/api-key/apply
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "name": "jack",
  "group_id": 1,
  "role": "user"
}
```

Apply an api key with admin role

```
POST {{hostLocal}}/admin/api-key/apply
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "name": "rob",
  "group_id": 1,
  "role": "admin"
}
```
