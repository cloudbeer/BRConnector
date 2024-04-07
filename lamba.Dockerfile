FROM node:20

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter

ENV AWS_LWA_PORT=8866
ENV AWS_LWA_INVOKE_MODE=response_stream

WORKDIR /app

COPY ./dist/server .

COPY ./src/scripts/create.sql ./src/scripts/create.sql

COPY ./package.json .

RUN npm install --omit=dev

EXPOSE 8866

CMD ["node", "index.js"]

