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


  function createGist(opts) {
    console.log('Posting request to GitHub API...');
    fetch('http://127.0.0.1:8866/v1/chat/completions', {
      method: 'post',
      body: JSON.stringify(opts)
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Created Gist:', data.html_url);
    });
  }
  