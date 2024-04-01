curl http://172.27.32.1:8866/v1/chat/completions -v \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "model": "claude-3-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "ping"
      }
    ],
    "max_tokens": 4096
  }
  '
