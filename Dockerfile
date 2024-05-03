FROM node:20

COPY ./dist /app

COPY ./src/scripts/create.sql ./src/scripts/create.sql

WORKDIR /app

COPY ./package.json .

RUN npm install --omit=dev

HEALTHCHECK --interval=5s --timeout=3s \
  CMD curl -fs http://localhost:8866/ || exit 1

EXPOSE 8866

CMD ["node", "server/index.js"]

