<div align="center">
<img src="./src/public/img/bedrock_32.svg" alt="icon"/>

<h1 align="center">BRProxy</h1>

English / [简体中文](./README_CN.md)

</div>


BRProxy is a bedrock API forwarding tool that can issue virtual keys, log chats, and manage costs. 

It is compatible with [BRClient](https://github.com/DamonDeng/BRClient) and any other OPENAI client that can define Host and API Key.

## Deploying BRProxy

Although this project is in rapic iterating, we still provide a relative easy way to deploy the BRProxy server.

Please follow these steps to deploy the BRProxy server:

#### 1. Prepare a server to host BRProxy.
Launch an EC2 on AWS or any other server with docker support.

#### 2. Run postgres with docker:

Launch a docker container to host postgres with the following shell command:

```shell
docker run --name postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -d postgres
```

Then create a database named `brproxydb` with the following command:
At first, attach to the prostgress container:
```shell
docker exec -it postgres psql -U postgres
```
Then, in the SQL command line of postgres, run the following command to create the database:

```sql
CREATE DATABASE brproxydb;
```

The database name is not necessary to be `brproxydb`, you can use what ever valid database name you want.
If you use your own database name, make sure that you remember the database name and replace `brproxydb` with your database name.


#### 3. Start the BRProxy server with docker

Run the following docker command directly to start the BRProxy container.

Make sure to replace the value of access key, secret key, region to be right ones

And, important! replace the value of ADMIN_API_KEY to be a complex key instead of using the simple one in the sample.

```shell
docker run --name brproxy \
 -p 8866:8866 \
 -e AWS_ACCESS_KEY_ID=xxxx \
 -e AWS_SECRET_ACCESS_KEY=xxxxx \
 -e AWS_DEFAULT_REGION=us-east-1 \
 -e PGSQL_HOST=172.17.0.1 \
 -e PGSQL_DATABASE=brproxydb \
 -e PGSQL_USER=postgres \
 -e PGSQL_PASSWORD=mysecretpassword \
 -e ADMIN_API_KEY=br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
 -d cloudbeer/brproxy:0.0.6
```

#### 4. Test the BRProxy server

Now, you have the first admin user with the API_KEY "br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

And the BRProxy server export port 8866 to the hosting EC2.

Test the server with the API_Key using `curl` command: 

```shell
curl "http://localhost:8866/admin/api-key/list"     -H "Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

```

You will get something like the following if every things go well:

```
{"success":true,"data":{"items":[],"total":"0","limit":20,"offset":0}}
```

#### 5. Creat the first admin user:

The API_KEY configed above is only used for booting the server and create first admin user.
This API_KEY is not designed to be used as admin user or normal user.

Create the first user with the following command:

```shell
curl -X POST "http://localhost:8866/admin/api-key/apply" \
     -H "Content-Type: application/json" \
	 -H "Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
     -d '{"name": "adminuser","group_id": 1,"role": "admin","email": "", "month_quota":"20"}'

```

You will get some response like the following:

```shell

{"success":true,"data":{"id":3,"name":"adminuser","email":"","api_key":"br-someotherkeyvaluexxxxx","role":"admin","month_quota":"20.0000000000","balance":"0.0000000000"}}

```

Record the new api_key for the new user, 
this api_key can be used to config BRClient to chat
and this api_key can be used to login BRProxyManager to manage other users.

#### 6. Config BRClient to connect to the BRProxy server.

As BRClient only support HTTPS, you need to setup a SSL offload service in front of the BRProxy server.

One simple way to do it on AWS is creating a CloudFront CDN to provide SSL support.

For more information about setting up CloudFront on AWS, please refer to official document of AWS.

One note: please enable header forwarding and query string forwarding in your CloudFront, to make sure that all the necessary information from BRClient can be send to back end BRProxy server.

Then, open BRClient, enter configuration page, find a setting name: "Enabel BRProxy", switch the value to "True".

Then you will find a two fields to enter "AWS Endpoint" and "API Key".
In the "AWS Endpoint" field, enter the CloudFront url.
In the "APK Key" field, enter the API_Key of your first admin user, which is the one you created in step 5.

Then, open a new chat to test.

If every thing goes well, you can start to chat.

#### 7. Config BRProxyManager to manager the BRProxy server.

Go to BRProxyManager repo:

[BRProxyManager](https://github.com/DamonDeng/BRProxyManager)

Follow the instructions to launch BRProxyManager.

In the login page:
Enter the URL of your BRProxy server. 
Use the API_Key you created in step 5 to login.

Then you can start to create other users and manager other users with the UI.


## Dev Mode

 ### Run postgres locally:

 ```shell
 docker run --name postgres \
   -e POSTGRES_PASSWORD=mysecretpassword \
   -p 5432:5432 \
   -d postgres
 ```

 Create an database named `eiai_proxy`:

 ```shell
 docker exec -it postgres psql -U postgres
 ```
 and run

 ```sql
 CREATE DATABASE eiai_proxy;
 ```


 ### Environment .env file

 Place it in the root directory of the project.

 ```env
 PGSQL_HOST=127.0.0.1
 PGSQL_DATABASE=eiai_proxy
 PGSQL_USER=postgres
 PGSQL_PASSWORD=mysecretpassword
 PGSQL_DEBUG_MODE=ok
 ADMIN_API_KEY=br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 ```


 ### Run it:

 ```shell
 npm run dev
 # or
 yarn dev
 ```

 If you have configured postgres, the tables will be created automatically.


 ### Test it

 - Use [BRClient](https://github.com/DamonDeng/BRClient) to test AI APIs.

 - Use Postman to test it. 

 - Some APIs' spec will be found in `test/api.rest`

 ## Prod mode

 Configure your environment variables.

 Managed RDS for postgres is recommended.

 ```shell
 npm run build 

 # then

 node dist/server/node.js
 ```

 or 

 refer to the [Dockerfile](./Dockerfile) to organize your folder and dependencies.

 or

 ```shell
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
  -e PGSQL_DATABASE=eiai_proxy \
  -e PGSQL_USER=postgres \
  -e PGSQL_PASSWORD=mysecretpassword \
  -e ADMIN_API_KEY=br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  -d cloudbeer/brproxy:0.0.6
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

### Admin API

Create an api key

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

Create an api key with admin role

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

Update api key's info

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

recharge up an  API key

```text
POST /admin/api-key/recharge
Content-Type: application/json
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
  "api_key": "br-xxxxxxxxxxxxxxx",
  "balance": 0.23
}
```

recharge history

```
GET /admin/payment/list?key_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

```

List api keys

```text
GET /admin/api-key/list?q=&limit=10&offset=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

List sessions

```text
GET /admin/session/list?q=&limit=10&offset=&key_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


List threads / histories

```text
GET /admin/thread/list?q=&limit=10&offset=&key_id=&session_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


### User API


My sessions

```text
GET /user/session/list?q=&limit=10&offset=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

My session detail

```text
GET /user/session/detail/1
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


My threads / histories

```text
GET /user/thread/list?q=&limit=10&offset=&session_id=
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

My thread detail

```text
GET /user/thread/detail/1
Authorization: Bearer br_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Disclaimer


BRProxy is an open-source software aimed at providing proxy services for using Bedrock Claude. We make our best efforts to ensure the security and legality of the software, but we are not responsible for the users' behavior.

BRProxy is intended solely for personal learning and research purposes. Users shall not use BRProxy for any illegal activities, including but not limited to hacking, spreading illegal information, etc. Otherwise, users shall bear the corresponding legal responsibilities themselves. Users are responsible for complying with the laws and regulations in their respective jurisdictions and shall not use BRProxy for any illegal or non-compliant purposes. The developers and maintainers of this software shall not be liable for any disputes, losses, or legal liabilities arising from the use of BRProxy.

We reserve the right to modify or terminate the BRProxy service at any time without further notice. Users are expected to understand and comply with the relevant local laws and regulations.

If you have any questions regarding this disclaimer, please feel free to contact us through the open-source channels.