# trunk-ignore-all(checkov/CKV_DOCKER_3)
FROM node:lts-alpine3.19

# Node 20.14.0 Iron Latest LTS

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD lsof -t -i:3001 > /dev/null && echo 0 || echo 1