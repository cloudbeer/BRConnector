FROM node:20


COPY ./dist /app

COPY ./src/scripts/create.sql ./src/scripts/create.sql

WORKDIR /app/server

COPY ./package.json .

RUN npm install --omit=dev

EXPOSE 8866

CMD ["node", "index.js"]

