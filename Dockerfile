FROM node:20

WORKDIR /app

COPY ./dist/server .

RUN npm install --omit=dev

EXPOSE 8866

CMD ["node", "index.js"]

