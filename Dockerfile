FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/

RUN npm config set maxsockets 3

RUN npm ci --loglevel verbose

RUN mkdir -p .nx/workspace-data && chown -R node:node .nx

COPY . .

USER root

CMD npm run start:auth && npm run start:be && npm run start:fe
