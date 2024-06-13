# trunk-ignore-all(checkov/CKV_DOCKER_3)
FROM node:lts-alpine3.19

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
