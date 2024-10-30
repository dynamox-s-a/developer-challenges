FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

RUN mkdir -p .nx/workspace-data && chown -R node:node .nx

COPY . .

USER root

CMD npm run start:auth && npm run start:be && npm run start:fe
