<div align="center">
<img src="./src/public/img/bedrock_32.svg" alt="icon"/>

<h1 align="center">BRProxy</h1>

[English](./README.md) / 简体中文


</div>

BRProxy 是一个 AWS Bedrock 的 API 转发工具, 可以发布虚拟密钥、记录聊天记录并进行费用控制等。

它与  [BRClient](https://github.com/DamonDeng/BRClient) 以及任何其他可以定义 Host 和 API Key 的 OPENAI 客户端工具兼容。


## 开发模式

### 本地启动 PostgreSQL:

```shell
docker run --name postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -d postgres
```

创建一个库，名字为 `eiai_proxy` (也可以是其他的):

```shell
docker exec -it postgres psql -U postgres
```

然后运行：

```sql
CREATE DATABASE eiai_proxy;
```


### 环境变量 .env 

在项目根目录下创建 .env 文件

```env
PGSQL_HOST=127.0.0.1
PGSQL_DATABASE=eiai_proxy
PGSQL_USER=postgres
PGSQL_PASSWORD=mysecretpassword
PGSQL_DEBUG_MODE=ok
ADMIN_API_KEY=br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


### 启动应用

别忘记安装依赖。

```shell
npm run dev
# or
yarn dev
```

如果你配置了 pg 的参数，系统会自动创建表。

### 测试

- 使用 [BRClient](https://github.com/DamonDeng/BRClient) 测试 AI 的 API.

- 用 Postman 等工具. 

- 比较完整的 API 描述在这个文件 `test/api.rest`

## 生产模式

在你运行主机上设置相应的环境变量。

Postgres 建议使用云厂商的托管 RDS。

```shell
npm run build 

# then

node dist/server/node.js
```

或者

参考 [Dockerfile](./Dockerfile) 组织编译后的 js 文件，并安装好依赖。

或者直接用 ts-node 运行。

```shell
yarn start
```


## Docker

如果你准备自己构建 docker 镜像：

本项目没有使用多级构建，所以构建镜像之前，请先本地编译源代码，运行  `npm run build` 。

或者直接使用官方镜像，运行:

```shell
docker run --name brproxy \
 -p 8866:8866 \
 -e AWS_ACCESS_KEY_ID=xxxx \
 -e AWS_SECRET_ACCESS_KEY=xxxxx \
 -e AWS_DEFAULT_REGION=us-east-1 \
 -e PGSQL_HOST=127.0.0.1 \
 -e PGSQL_DATABASE=eiai_proxy \
 -e PGSQL_USER=postgres \
 -e PGSQL_PASSWORD=mysecretpassword \
 -e ADMIN_API_KEY=br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
 -d cloudbeer/brproxy:0.0.6
```

可以到 [docker hub](https://hub.docker.com/r/cloudbeer/brproxy/tags) 上看看有没有更新的镜像。


## API 说明

### 聊天 API

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

### 管理端

创建一个 api key (用户)

```text
POST /admin/api-key/apply
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "name": "jack",
  "group_id": 1,
  "role": "user",
  "email": "",
  "month_quota": 1.00
}
```

创建一个 api key (用户)，并且有管理员权限

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

更新 api key 信息

```text
POST /admin/api-key/update
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "id": 2,
  "name": "张三",
  "month_quota": 10.00
}
```


给 api key 充值

```text
POST /admin/api-key/recharge
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "api_key": "br-xxxxxxxxxxxxxxx",
  "balance": 0.23
}
```

充值历史

```
GET /admin/payment/list?key_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

```

列表显示 api key

```text
GET /admin/api-key/list?q=&limit=10&offset=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

列表显示 会话

```text
GET /admin/session/list?q=&limit=10&offset=&key_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

列表显示 对话

```text
GET /admin/thread/list?q=&limit=10&offset=&key_id=&session_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### User API

我的会话

```text
GET /user/session/list?q=&limit=10&offset=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

我的会话详情

```text
GET /user/session/detail/1
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


我的对话列表

```text
GET /user/thread/list?q=&limit=10&offset=&session_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

我的对话详情

```text
GET /user/thread/detail/1
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 免责声明

BRProxy是一款开源软件,旨在为使用 Bedrock Claude 提供代理服务。我们尽最大努力确保软件的安全性和合法性,但不对使用者的行为负责。

BRProxy仅供个人学习和研究使用。用户不得将BRProxy用于任何非法活动,包括但不限于黑客攻击、传播违法信息等,否则将自行承担相应的法律责任。使用者有责任遵守所在地区的法律法规,不得将 BRProxy 用于任何非法或违规的目的。如因使用BRProxy而产生的任何纠纷、损失或法律责任,本软件的开发者和维护者概不负责。

我们保留随时修改或终止BRProxy服务的权利,恕不另行通知。请用户理解并遵守当地的相关法律法规。

如果您对免责声明有任何疑问,欢迎通过开源渠道与我们联系。